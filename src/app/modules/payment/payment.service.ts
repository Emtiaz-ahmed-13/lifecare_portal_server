import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import config from '../../../config';
import { prisma } from '../../shared/prisma';

const stripe = new Stripe((config.stripe_secret_key || "sk_test_mock_key") as string);

const initPayment = async (appointmentId: string) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { doctor: true, patient: true }
    });

    if (!appointment) {
        throw new Error("Appointment not found");
    }

    if (appointment.paymentStatus === PaymentStatus.PAID) {
        throw new Error("Appointment is already paid");
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Appointment with ${appointment.doctor.name}`,
                        description: `Appointment fee for ${appointment.doctor.name}`,
                    },
                    unit_amount: appointment.doctor.appointmentFee * 100, // Fee in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/api/v1/payment/validate?sessionId={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}`,
        cancel_url: `http://localhost:3000/payment/cancel`, // Frontend cancel URL
    });

    // Save initial payment record
    await prisma.payment.create({
        data: {
            appointmentId: appointment.id,
            transactionId: session.id,
            amount: appointment.doctor.appointmentFee,
            status: PaymentStatus.UNPAID
        }
    });

    return {
        paymentUrl: session.url
    };
};

const validatePayment = async (payload: any) => {
    const { sessionId, appointmentId } = payload;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
        throw new Error("Payment verification failed");
    }

    // Update Payment and Appointment
    const result = await prisma.$transaction(async (tx) => {
        await tx.payment.updateMany({
            where: { transactionId: sessionId },
            data: {
                status: PaymentStatus.PAID,
                gatewayData: session as any
            }
        });

        const updatedAppointment = await tx.appointment.update({
            where: { id: appointmentId },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        });

        return updatedAppointment;
    });

    return {
        message: "Payment verified successfully",
        data: result
    };
};

const webhook = async (req: any) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.stripe_webhook_secret as string
        );
    } catch (err: any) {
        throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const transactionId = session.id;

        await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findFirst({
                where: { transactionId }
            });

            if (payment) {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: PaymentStatus.PAID,
                        gatewayData: session as any
                    }
                });

                await tx.appointment.update({
                    where: { id: payment.appointmentId },
                    data: {
                        paymentStatus: PaymentStatus.PAID
                    }
                });
            }
        });
    }

    return { received: true };
};

export const PaymentService = {
    initPayment,
    validatePayment,
    webhook
};

import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import { EmailHelper } from "../../helper/emailSender";
import { prisma } from "../../shared/prisma";

const createPrescription = async (user: any, payload: any) => {
    // 1. Verify Doctor
    const doctor = await prisma.doctor.findUnique({
        where: { email: user.email }
    });
    if (!doctor) throw new Error("Doctor not found");

    // 2. Verify Appointment
    // Doctor can only prescribe for THEIR appointments
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: payload.appointmentId,
            doctorId: doctor.id
        },
        include: {
            patient: true // Include patient to get email
        }
    });

    if (!appointment) {
        throw new Error("Appointment not found or does not belong to this doctor");
    }

    // 3. Transaction: Create Prescription & Update Appointment Status
    const result = await prisma.$transaction(async (tx) => {
        const prescription = await tx.prescription.create({
            data: {
                appointmentId: payload.appointmentId,
                doctorId: doctor.id,
                patientId: appointment.patientId,
                instructions: payload.instructions,
                followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : null
            },
            include: {
                patient: true
            }
        });

        await tx.appointment.update({
            where: { id: appointment.id },
            data: {
                status: AppointmentStatus.COMPLETED,
                paymentStatus: PaymentStatus.PAID // Assuming giving prescription means session is done and paid/settled
            }
        });

        return prescription;
    });

    try {
        await EmailHelper.sendEmail(
            appointment.patient.email,
            "New Prescription Issued",
            `Hello, Dr. ${doctor.name} has issued a new prescription for you. Check your dashboard for details.`
        );
    } catch (error) {
        console.error("Email error:", error);
    }

    return result;
};

const getMyPrescriptions = async (user: any) => {
    const patient = await prisma.patient.findUnique({
        where: { email: user.email }
    });
    if (!patient) throw new Error("Patient not found");

    const result = await prisma.prescription.findMany({
        where: {
            patientId: patient.id
        },
        include: {
            doctor: true,
            appointment: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return result;
};

export const PrescriptionService = {
    createPrescription,
    getMyPrescriptions
};

import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import { EmailHelper } from "../../helper/emailSender";
import { prisma } from "../../shared/prisma";

const bookAppointment = async (payload: any, user: any) => {
    // 1. Find patient using user email
    const patient = await prisma.patient.findUnique({
        where: { email: user.email }
    });

    if (!patient) {
        throw new Error("Patient not found");
    }

    // 2. Check if schedule exists and is NOT booked
    const doctorSchedule = await prisma.doctorSchedule.findUnique({
        where: {
            scheduleId_doctorId: {
                scheduleId: payload.scheduleId,
                doctorId: payload.doctorId
            }
        },
        include: {
            schedule: true
        }
    });

    if (!doctorSchedule) {
        throw new Error("Doctor schedule not found!");
    }

    if (doctorSchedule.isBooked) {
        throw new Error("This schedule is already booked!");
    }

    // 3. Create appointment & Mark schedule as booked (Transaction)
    const result = await prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: payload.doctorId,
                scheduleId: payload.scheduleId,
                videoCallingId: crypto.randomUUID(),
                status: AppointmentStatus.SCHEDULED,
                paymentStatus: PaymentStatus.UNPAID
            }
        });

        await tx.doctorSchedule.update({
            where: {
                scheduleId_doctorId: {
                    scheduleId: payload.scheduleId,
                    doctorId: payload.doctorId
                }
            },
            data: {
                isBooked: true
            }
        });

        return appointment;
    });

    // Send Email Notification
    // Ideally this should be asynchronous/queued so it doesn't block the response
    try {
        const patient = await prisma.patient.findUnique({ where: { id: user.id } }); // Assuming user.id helps or we fetch from DB
        const doctor = await prisma.doctor.findUnique({ where: { id: payload.doctorId } });

        // Wait, 'user' arg in this function is the logged-in user (Patient).
        // Let's refactor slightly to ensure we have emails.
        if (patient && doctor) {
            await EmailHelper.sendEmail(
                doctor.email,
                "New Appointment Booked",
                `Hello Dr. ${doctor.name}, you have a new appointment with ${patient.name} on ${doctorSchedule.schedule.startDate.toDateString()} from ${doctorSchedule.schedule.startDate.toLocaleTimeString()} to ${doctorSchedule.schedule.endDate.toLocaleTimeString()}.`
            );
            await EmailHelper.sendEmail(
                patient.email,
                "Appointment Confirmed",
                `Hello ${patient.name}, your appointment with Dr. ${doctor.name} is confirmed for ${doctorSchedule.schedule.startDate.toDateString()} from ${doctorSchedule.schedule.startDate.toLocaleTimeString()} to ${doctorSchedule.schedule.endDate.toLocaleTimeString()}.`
            );
        }
    } catch (error) {
        console.error("Failed to send email:", error);
    }

    return result;
};

const getMyAppointments = async (user: any) => {
    // Determine if user is Patient or Doctor
    if (user.role === 'PATIENT') {
        const patient = await prisma.patient.findUnique({ where: { email: user.email } });
        if (!patient) throw new Error("Patient not found");
        return await prisma.appointment.findMany({
            where: { patientId: patient.id },
            include: { doctor: true, schedule: true }
        });
    } else if (user.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({ where: { email: user.email } });
        if (!doctor) throw new Error("Doctor not found");
        return await prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            include: { patient: true, schedule: true }
        });
    }
    return [];
};

export const AppointmentService = {
    bookAppointment,
    getMyAppointments
};

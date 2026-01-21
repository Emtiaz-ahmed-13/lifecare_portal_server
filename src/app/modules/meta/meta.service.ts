import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";

// Service for handling meta data and dashboard statistics

const getDashboardStats = async (user: any) => {

    const doctorCount = await prisma.doctor.count({ where: { isDeleted: false } });

    const patientCount = await prisma.patient.count({ where: { isDeleted: false } });

    const appointmentCount = await prisma.appointment.count();
    const paymentData = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    });

    return {
        doctorCount,
        patientCount,
        appointmentCount,
        totalRevenue: paymentData._sum.amount || 0
    };
};

export const MetaService = {
    getDashboardStats
};

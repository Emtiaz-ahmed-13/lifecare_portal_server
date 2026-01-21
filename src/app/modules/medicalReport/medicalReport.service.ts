import { prisma } from "../../shared/prisma";

const createReport = async (user: any, payload: any) => {
    const patient = await prisma.patient.findUnique({ where: { email: user.email } });
    if (!patient) throw new Error("Patient not found");

    const result = await prisma.medicalReport.create({
        data: {
            patientId: patient.id,
            reportName: payload.reportName,
            reportLink: payload.reportLink
        }
    });

    return result;
};

const getReports = async (user: any) => {
    const patient = await prisma.patient.findUnique({ where: { email: user.email } });
    if (!patient) throw new Error("Patient not found");

    const result = await prisma.medicalReport.findMany({
        where: {
            patientId: patient.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};

export const MedicalReportService = {
    createReport,
    getReports
};

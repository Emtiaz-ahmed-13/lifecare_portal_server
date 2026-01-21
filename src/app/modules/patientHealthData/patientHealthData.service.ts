import { prisma } from "../../shared/prisma";

const createOrUpdateHealthData = async (user: any, payload: any) => {
    const patient = await prisma.patient.findUnique({ where: { email: user.email } });
    if (!patient) throw new Error("Patient not found");

    const healthData = await prisma.patientHealthData.upsert({
        where: {
            patientId: patient.id
        },
        update: payload,
        create: {
            ...payload,
            patientId: patient.id
        }
    });

    return healthData;
};

const getHealthData = async (user: any) => {
    const patient = await prisma.patient.findUnique({ where: { email: user.email } });
    if (!patient) throw new Error("Patient not found");

    const result = await prisma.patientHealthData.findUnique({
        where: {
            patientId: patient.id
        }
    });
    return result;
};

export const PatientHealthDataService = {
    createOrUpdateHealthData,
    getHealthData
};

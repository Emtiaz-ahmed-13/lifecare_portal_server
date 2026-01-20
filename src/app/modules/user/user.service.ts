import bcrypt from 'bcryptjs';

import { fileUploader } from '../../helper/fileUploader';
import { prisma } from '../../shared/prisma';
import { createPatientInput } from "./user.interface";

const createPatient = async (payload: createPatientInput, file: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.patient.email
        }
    });

    if (isUserExist) {
        throw new Error("User with this email already exists!");
    }

    if (file) {
        const uploadResponse: any = await fileUploader.uploadToCloudinary(file);
        payload.patient.profilePhoto = uploadResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        // Create User
        await tnx.user.create({
            data: {
                name: payload.patient.name,
                email: payload.patient.email,
                password: hashedPassword,
                role: "PATIENT"
            }
        });

        // Create Patient
        const newPatient = await tnx.patient.create({
            data: {
                name: payload.patient.name,
                email: payload.patient.email,
                address: payload.patient.address,
                profilePhoto: payload.patient.profilePhoto
            }
        });

        return newPatient;
    });

    return result;

}

export const UserService = {
    createPatient
}

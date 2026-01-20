import bcrypt from 'bcryptjs';

import { fileUploader } from '../../helper/fileUploader';
import { prisma } from '../../shared/prisma';
import { createAdminInput, createDoctorInput, createPatientInput } from "./user.interface";

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

const createAdmin = async (payload: createAdminInput, file: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.admin.email
        }
    });

    if (isUserExist) {
        throw new Error("User with this email already exists!");
    }

    if (file) {
        const uploadResponse: any = await fileUploader.uploadToCloudinary(file);
        payload.admin.profilePhoto = uploadResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        // Create User
        await tnx.user.create({
            data: {
                name: payload.admin.name,
                email: payload.admin.email,
                password: hashedPassword,
                role: "ADMIN"
            }
        });

        // Create Admin
        const newAdmin = await tnx.admin.create({
            data: {
                name: payload.admin.name,
                email: payload.admin.email,
                contactNumber: payload.admin.contactNumber,
                profilePhoto: payload.admin.profilePhoto
            }
        });

        return newAdmin;
    });

    return result;
}

const createDoctor = async (payload: createDoctorInput, file: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    });

    if (isUserExist) {
        throw new Error("User with this email already exists!");
    }

    if (file) {
        const uploadResponse: any = await fileUploader.uploadToCloudinary(file);
        payload.doctor.profilePhoto = uploadResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        // Create User
        await tnx.user.create({
            data: {
                name: payload.doctor.name,
                email: payload.doctor.email,
                password: hashedPassword,
                role: "DOCTOR"
            }
        });

        // Create Doctor
        const newDoctor = await tnx.doctor.create({
            data: {
                name: payload.doctor.name,
                email: payload.doctor.email,
                contactNumber: payload.doctor.contactNumber,
                address: payload.doctor.address,
                registrationNumber: payload.doctor.registrationNumber,
                experience: Number(payload.doctor.experience),
                gender: payload.doctor.gender,
                appointmentFee: Number(payload.doctor.appointmentFee),
                qualifications: payload.doctor.qualifications,
                currentWorkingPlace: payload.doctor.currentWorkingPlace,
                designation: payload.doctor.designation,
                profilePhoto: payload.doctor.profilePhoto
            }
        });

        return newDoctor;
    });

    return result;
}

export const UserService = {
    createPatient,
    createAdmin,
    createDoctor
}

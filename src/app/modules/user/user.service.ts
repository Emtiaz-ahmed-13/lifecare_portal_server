import bcrypt from 'bcryptjs';

import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { fileUploader } from '../../helper/fileUploader';
import { PaginationOptions, paginationHelper } from '../../helper/paginationHelpter';
import { prisma } from '../../shared/prisma';
import { userSearchableFields } from './user.constant';
import { createAdminInput, createDoctorInput, createPatientInput } from "./user.interface";

export type UserFilters = {
    searchTerm?: string;
    role?: string;
    status?: string;
    email?: string;
};

const createPatient = async (payload: createPatientInput, file: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.patient.email
        }
    });

    if (isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists!");
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
        throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists!");
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
        throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists!");
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

const getAllFromDb = async (
    options: PaginationOptions,
    filters: UserFilters
) => {
    const { skip, take, orderBy } =
        paginationHelper.calculatePagination(options);

    const { searchTerm, role, status, email } = filters;

    const andConditions: any[] = [];

    // 🔍 Search (OR on searchable fields)
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // 🎭 Role filter
    if (role) {
        andConditions.push({
            role,
        });
    }

    // 📌 Status filter
    if (status) {
        andConditions.push({
            status,
        });
    }

    // 📧 Email filter (exact match)
    if (email) {
        andConditions.push({
            email,
        });
    }

    const whereConditions =
        andConditions.length > 0 ? { AND: andConditions } : undefined;

    const result = await prisma.user.findMany({
        skip,
        take,
        where: whereConditions,
        orderBy,
    });

    return result;
};



const getMyProfile = async (user: any) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: "ACTIVE"
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true
        }
    });

    return userInfo;
}

const updateMyProfile = async (user: any, payload: any, file: any) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: "ACTIVE"
        }
    });

    if (file) {
        const uploadResponse: any = await fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = uploadResponse.secure_url;
    }

    let profileData: any;

    if (userInfo.role === 'ADMIN') {
        profileData = await prisma.admin.update({
            where: { email: userInfo.email },
            data: payload
        });
    } else if (userInfo.role === 'DOCTOR') {
        profileData = await prisma.doctor.update({
            where: { email: userInfo.email },
            data: payload
        });
    } else if (userInfo.role === 'PATIENT') {
        profileData = await prisma.patient.update({
            where: { email: userInfo.email },
            data: payload
        });
    }

    return profileData;
}

export const UserService = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFromDb,
    getMyProfile,
    updateMyProfile
}

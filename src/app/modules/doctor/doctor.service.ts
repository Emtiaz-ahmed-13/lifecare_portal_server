import { Doctor, Prisma } from "@prisma/client";
import { paginationHelper, PaginationOptions } from "../../helper/paginationHelpter";
import { prisma } from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorFilterRequest } from "./doctor.interface";

const getAllFromDb = async (
    filters: IDoctorFilterRequest,
    options: PaginationOptions
) => {
    const { limit, page } = options;
    const { skip, take, orderBy } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (specialties) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : { isDeleted: false };

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy,
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        },
    });

    const total = await prisma.doctor.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getByIdFromDb = async (id: number) => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });
    return result;
}

const updateIntoDb = async (id: number, payload: Partial<Doctor>) => {
    const result = await prisma.doctor.update({
        where: {
            id,
            isDeleted: false,
        },
        data: payload,
    });
    return result;
}

const deleteDoctorSpecialty = async (id: number, specialtyId: string) => {
    const result = await prisma.doctorSpecialties.delete({
        where: {
            specialitiesId_doctorId: {
                doctorId: id,
                specialitiesId: specialtyId
            }
        }
    })
    return result;
}

const addDoctorSpecialty = async (id: number, payload: any) => {
    const result = await prisma.doctorSpecialties.create({
        data: {
            doctorId: id,
            specialitiesId: payload.specialitiesId
        }
    })
    return result;
}

export const DoctorService = {
    getAllFromDb,
    getByIdFromDb,
    updateIntoDb,
    deleteDoctorSpecialty,
    addDoctorSpecialty
};

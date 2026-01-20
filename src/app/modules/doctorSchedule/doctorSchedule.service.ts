import { paginationHelper } from "../../helper/paginationHelpter";
import { prisma } from "../../shared/prisma";

/* =========================
   🔹 Create doctor schedules
   ========================= */
const insertIntoDB = async (
    user: { email: string },
    payload: { scheduleIds: string[] }
) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });

    const doctorScheduleData = payload.scheduleIds.map(
        (scheduleId) => ({
            doctorId: doctorData.id,
            scheduleId,
        })
    );

    const result = await prisma.doctorSchedule.createMany({
        data: doctorScheduleData,
        skipDuplicates: true,
    });

    return result;
};

/* =========================
   🔹 Get all doctor schedules
   ========================= */
const getAllFromDB = async (
    options: {
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    },
    filters: {
        startDate?: string;
        endDate?: string;
    }
) => {
    const { skip, take, orderBy } =
        paginationHelper.calculatePagination(options);

    const { startDate, endDate } = filters;

    const andConditions: any[] = [];

    if (startDate) {
        andConditions.push({
            schedule: {
                startDate: {
                    gte: new Date(startDate),
                },
            },
        });
    }

    if (endDate) {
        andConditions.push({
            schedule: {
                endDate: {
                    lte: new Date(endDate),
                },
            },
        });
    }

    const whereConditions =
        andConditions.length > 0 ? { AND: andConditions } : undefined;

    const result = await prisma.doctorSchedule.findMany({
        skip,
        take,
        where: whereConditions,
        orderBy,
        include: {
            schedule: true,
            doctor: true,
        },
    });

    return result;
};

/* =========================
   🔹 Doctor-wise schedules
   ========================= */
const schedulesForDoctor = async (
    filters: {
        doctorId: number;
        startDate?: string;
        endDate?: string;
        isBooked?: boolean;
    },
    options: {
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }
) => {
    const { skip, take, orderBy } =
        paginationHelper.calculatePagination(options);

    const { doctorId, startDate, endDate, isBooked } = filters;

    const andConditions: any[] = [];

    andConditions.push({ doctorId });

    if (startDate) {
        andConditions.push({
            schedule: {
                startDate: {
                    gte: new Date(startDate),
                },
            },
        });
    }

    if (endDate) {
        andConditions.push({
            schedule: {
                endDate: {
                    lte: new Date(endDate),
                },
            },
        });
    }

    if (typeof isBooked === "boolean") {
        andConditions.push({ isBooked });
    }

    const whereConditions =
        andConditions.length > 0 ? { AND: andConditions } : undefined;

    const result = await prisma.doctorSchedule.findMany({
        skip,
        take,
        where: whereConditions,
        orderBy,
        include: {
            schedule: true,
        },
    });

    return result;
};

/* =========================
   🔹 Delete doctor schedule
   ========================= */
const deleteScheduleFromDB = async (payload: {
    scheduleId: string;
    doctorId: number;
}) => {
    const result = await prisma.doctorSchedule.delete({
        where: {
            scheduleId_doctorId: {
                scheduleId: payload.scheduleId,
                doctorId: payload.doctorId,
            },
        },
    });

    return result;
};


export const DoctorScheduleService = {
    insertIntoDB,
    getAllFromDB,
    schedulesForDoctor,
    deleteScheduleFromDB,
};

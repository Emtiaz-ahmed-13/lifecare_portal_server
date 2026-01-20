import { addDays, addMinutes, isBefore, isEqual, setHours, setMinutes } from "date-fns";
import { paginationHelper } from "../../helper/paginationHelpter";
import { prisma } from "../../shared/prisma";

const insertIntoDB = async (payload: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}) => {
    const { startDate, endDate, startTime, endTime } = payload;

    const intervalTime = 30;

    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (isBefore(currentDate, lastDate) || isEqual(currentDate, lastDate)) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        let currentSlot = setMinutes(setHours(currentDate, startHour), startMinute);
        const endSlot = setMinutes(setHours(currentDate, endHour), endMinute);

        while (isBefore(currentSlot, endSlot)) {
            await prisma.schedule.create({
                data: {
                    startDate: currentSlot,
                    endDate: addMinutes(currentSlot, intervalTime),
                },
            });

            currentSlot = addMinutes(currentSlot, intervalTime);
        }

        currentDate = addDays(currentDate, 1);
    }

    return { message: "Schedule created successfully" };
};

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
            startDate: {
                gte: new Date(startDate),
            },
        });
    }

    if (endDate) {
        andConditions.push({
            endDate: {
                lte: new Date(endDate),
            },
        });
    }

    const whereConditions =
        andConditions.length > 0 ? { AND: andConditions } : undefined;

    const result = await prisma.schedule.findMany({
        skip,
        take,
        where: whereConditions,
        orderBy,
    });

    return result;
};


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

    // 🔑 doctor filter (mandatory)
    andConditions.push({
        doctorId,
    });

    // 📅 startDate filter
    if (startDate) {
        andConditions.push({
            schedule: {
                startDate: {
                    gte: new Date(startDate),
                },
            },
        });
    }

    // 📅 endDate filter
    if (endDate) {
        andConditions.push({
            schedule: {
                endDate: {
                    lte: new Date(endDate),
                },
            },
        });
    }

    // 📌 booked / unbooked
    if (typeof isBooked === "boolean") {
        andConditions.push({
            isBooked,
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
        },
    });

    return result;
};
const deleteSchedule = async (id: string) => {
    const result = await prisma.schedule.delete({
        where: {
            id,
        },
    });

    return result;
};


export const ScheduleService = {
    insertIntoDB,
    getAllFromDB,
    schedulesForDoctor,
    deleteSchedule
};

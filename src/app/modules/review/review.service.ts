import { prisma } from "../../shared/prisma";

const createReview = async (user: any, payload: any) => {
    const patient = await prisma.patient.findUnique({ where: { email: user.email } });
    if (!patient) throw new Error("Patient not found");

    const review = await prisma.review.create({
        data: {
            patientId: patient.id,
            doctorId: payload.doctorId,
            rating: payload.rating,
            comment: payload.comment,
            // appointmentId is optional
        }
    });
    return review;
}

const getReviews = async (query: any) => {
    // Basic filter by doctorId
    const where: any = {};
    if (query.doctorId) {
        where.doctorId = Number(query.doctorId);
    }

    const reviews = await prisma.review.findMany({
        where,
        include: {
            patient: { select: { name: true, profilePhoto: true } }
        }
    });
    return reviews;
}

export const ReviewService = {
    createReview,
    getReviews
};

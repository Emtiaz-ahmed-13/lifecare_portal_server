import bcrypt from 'bcryptjs';

import { prisma } from "../shared/prisma";
import { createPatientInput } from "./user.interface";

const createPatient = async (payload: createPatientInput) => {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {

        const result = await prisma.$transaction(async (tnx) => {
            await tnx.user.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    password: hashedPassword
                }
            })
        })
    });

    return result;

}

export const UserService = {
    createPatient
}



import z from "zod";
const createPatientZodSchema = z.object({
    body: z.object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        patient: z.object({
            name: z.string().min(3, "Name must be at least 3 characters long"),
            email: z.string().email("Invalid email"),
            address: z.string().min(3, "Address must be at least 3 characters long"),
        })
    })
});

export const UserValidation = {
    createPatientZodSchema
}
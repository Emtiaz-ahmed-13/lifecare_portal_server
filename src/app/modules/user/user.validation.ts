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

const createAdminZodSchema = z.object({
    body: z.object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        admin: z.object({
            name: z.string().min(3, "Name must be at least 3 characters long"),
            email: z.string().email("Invalid email"),
            contactNumber: z.string().min(10, "Contact number must be at least 10 characters long"),
        })
    })
});

const createDoctorZodSchema = z.object({
    body: z.object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        doctor: z.object({
            name: z.string().min(3, "Name must be at least 3 characters long"),
            email: z.string().email("Invalid email"),
            contactNumber: z.string().min(10, "Contact number must be at least 10 characters long"),
            address: z.string().min(3, "Address must be at least 3 characters long"),
            registrationNumber: z.string().min(3, "Registration number must be at least 3 characters long"),
            experience: z.number().int().nonnegative(),
            gender: z.enum(["MALE", "FEMALE"]),
            appointmentFee: z.number().positive(),
            qualifications: z.string().min(3, "Qualifications must be at least 3 characters long"),
            currentWorkingPlace: z.string().min(3, "Current working place must be at least 3 characters long"),
            designation: z.string().min(3, "Designation must be at least 3 characters long"),
        })
    })
});

export const UserValidation = {
    createPatientZodSchema,
    createAdminZodSchema,
    createDoctorZodSchema
}
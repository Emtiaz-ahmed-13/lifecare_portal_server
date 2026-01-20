import z from "zod";

const doctorScheduleValidation = z.object({
    body: z.object({
        schedule: z.array(z.object({
            day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
            startTime: z.string(),
            endTime: z.string(),
        }))
    })
})

export const doctorScheduleValidationSchema = {
    doctorScheduleValidation
}
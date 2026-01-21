import { Gender, UserNeedPasswordChange, UserRole, UserStatus } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { prisma } from "./app/shared/prisma";

const seedData = async () => {
    try {
        // 1. Create Specialties
        const specialtiesData = [
            { title: "Cardiology", icon: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png" },
            { title: "Neurology", icon: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png" },
            { title: "Orthopedics", icon: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png" },
            { title: "Pediatrics", icon: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png" },
            { title: "Dermatology", icon: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png" },
        ];

        console.log("Seeding specialties...");
        for (const spec of specialtiesData) {
            const existing = await prisma.specialties.findFirst({
                where: { title: spec.title }
            });

            if (!existing) {
                await prisma.specialties.create({
                    data: spec
                });
            }
        }

        const allSpecialties = await prisma.specialties.findMany();

        // 2. Create Doctors
        const doctorsData = [
            {
                name: "Dr. John Doe",
                email: "john.doe@lifecare.com",
                contactNumber: "1234567890",
                address: "123 Medical Plaza",
                registrationNumber: "REG123",
                experience: 10,
                gender: Gender.MALE,
                appointmentFee: 500,
                qualifications: "MBBS, MD",
                currentWorkingPlace: "City Hospital",
                designation: "Senior Cardiologist",
                specialtyTitle: "Cardiology",
            },
            {
                name: "Dr. Jane Smith",
                email: "jane.smith@lifecare.com",
                contactNumber: "0987654321",
                address: "456 Health St",
                registrationNumber: "REG456",
                experience: 8,
                gender: Gender.FEMALE,
                appointmentFee: 400,
                qualifications: "MBBS, FCPS",
                currentWorkingPlace: "Unity Clinic",
                designation: "Neurologist",
                specialtyTitle: "Neurology",
            },
        ];

        const hashedPassword = await bcryptjs.hash("123456", 12);

        console.log("Seeding doctors and users...");
        for (const doc of doctorsData) {
            // Create User first
            const userData = await prisma.user.upsert({
                where: { email: doc.email },
                update: {},
                create: {
                    email: doc.email,
                    password: hashedPassword,
                    name: doc.name,
                    role: UserRole.DOCTOR,
                    status: UserStatus.ACTIVE,
                    needPasswordChange: UserNeedPasswordChange.FALSE,
                    needPasswordReset: false,
                },
            });

            // Create Doctor profile
            const { specialtyTitle, ...doctorProfile } = doc;
            const foundSpecialty = allSpecialties.find(s => s.title === specialtyTitle);

            const doctorData = await prisma.doctor.upsert({
                where: { email: doc.email },
                update: {},
                create: doctorProfile,
            });

            // Link specialty
            if (foundSpecialty) {
                await prisma.doctorSpecialties.upsert({
                    where: {
                        specialitiesId_doctorId: {
                            doctorId: doctorData.id,
                            specialitiesId: foundSpecialty.id,
                        },
                    },
                    update: {},
                    create: {
                        doctorId: doctorData.id,
                        specialitiesId: foundSpecialty.id,
                    },
                });
            }
        }

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
};

seedData();

export type createPatientInput = {
    password: string,
    patient: {
        name: string,
        email: string,
        address: string,
        profilePhoto?: string
    }
}

export type createAdminInput = {
    password: string,
    admin: {
        name: string,
        email: string,
        contactNumber: string,
        profilePhoto?: string
    }
}

export type createDoctorInput = {
    password: string,
    doctor: {
        name: string,
        email: string,
        contactNumber: string,
        address: string,
        registrationNumber: string,
        experience: number,
        gender: "MALE" | "FEMALE",
        appointmentFee: number,
        qualifications: string,
        currentWorkingPlace: string,
        designation: string,
        profilePhoto?: string
    }
}
# LifeCare Portal API Documentation 📑

**Base URL**: `http://localhost:5000/api/v1`

---

## 🔐 Authentication (`/auth`)

| Endpoint           | Method | Access                        | Description                                  |
| :----------------- | :----- | :---------------------------- | :------------------------------------------- |
| `/login`           | `POST` | Public                        | Login with email and password                |
| `/refresh-token`   | `POST` | Public                        | Get a new access token using a refresh token |
| `/change-password` | `POST` | User (Admin, Doctor, Patient) | Change current user password                 |
| `/forgot-password` | `POST` | Public                        | Request a password reset link                |
| `/reset-password`  | `POST` | Public                        | Reset password using a reset token           |

---

## 👤 User Management (`/user`)

| Endpoint             | Method  | Access                        | Description                                          |
| :------------------- | :------ | :---------------------------- | :--------------------------------------------------- |
| `/create-patient`    | `POST`  | Public                        | Register a new patient account with profile picture  |
| `/create-admin`      | `POST`  | Admin                         | Create a new admin account with profile picture      |
| `/create-doctor`     | `POST`  | Admin                         | Create a new doctor account with profile picture     |
| `/me`                | `GET`   | User (Admin, Doctor, Patient) | Get logged-in user's profile                         |
| `/update-my-profile` | `PATCH` | User (Admin, Doctor, Patient) | Update logged-in user's profile with profile picture |

---

## 🏨 Specialties (`/specialties`)

| Endpoint | Method   | Access | Description                       |
| :------- | :------- | :----- | :-------------------------------- |
| `/`      | `GET`    | Public | Get all medical specialties       |
| `/`      | `POST`   | Admin  | Create a new specialty with image |
| `/:id`   | `DELETE` | Admin  | Delete a specialty by ID          |

---

## 👨‍⚕️ Doctors (`/doctor`)

| Endpoint                        | Method   | Access       | Description                                             |
| :------------------------------ | :------- | :----------- | :------------------------------------------------------ |
| `/`                             | `GET`    | Public       | List all doctors with pagination, filtering and sorting |
| `/:id`                          | `GET`    | Public       | Get details of a specific doctor                        |
| `/:id`                          | `PATCH`  | Admin/Doctor | Update doctor information                               |
| `/suggest`                      | `POST`   | Public       | Get AI-powered doctor suggestions based on symptoms     |
| `/suggestion`                   | `GET`    | Public       | Get doctor suggestions (alternative endpoint)           |
| `/:id/specialties`              | `POST`   | Admin/Doctor | Add a specialty to a doctor                             |
| `/:id/specialties/:specialtyId` | `DELETE` | Admin/Doctor | Remove a specialty from a doctor                        |

---

## 📅 Scheduling - General Schedule (`/schedule`)

| Endpoint  | Method   | Access | Description                         |
| :-------- | :------- | :----- | :---------------------------------- |
| `/`       | `GET`    | Public | Get all general schedules           |
| `/`       | `POST`   | Admin  | Create a new general schedule block |
| `/doctor` | `GET`    | Public | Get schedules available for doctors |
| `/:id`    | `DELETE` | Admin  | Delete a schedule by ID             |

---

## 📅 Scheduling - Doctor Schedule (`/doctor-schedule`)

| Endpoint  | Method   | Access | Description                               |
| :-------- | :------- | :----- | :---------------------------------------- |
| `/`       | `POST`   | Doctor | Doctor books a schedule slot              |
| `/`       | `GET`    | Public | Get all doctor schedules                  |
| `/doctor` | `GET`    | Doctor | Get logged-in doctor's personal schedules |
| `/:id`    | `DELETE` | Admin  | Delete a doctor schedule by ID            |

---

## 🗓️ Appointments (`/appointment`)

| Endpoint           | Method | Access         | Description                          |
| :----------------- | :----- | :------------- | :----------------------------------- |
| `/`                | `POST` | Patient        | Book a new appointment with a doctor |
| `/my-appointments` | `GET`  | Patient/Doctor | Get logged-in user's appointments    |

---

## 💊 Prescriptions (`/prescription`)

| Endpoint            | Method | Access  | Description                             |
| :------------------ | :----- | :------ | :-------------------------------------- |
| `/`                 | `POST` | Doctor  | Create a new prescription for a patient |
| `/my-prescriptions` | `GET`  | Patient | Get logged-in patient's prescriptions   |

---

## 🏥 Patient Health Data (`/patient-health-data`)

| Endpoint | Method | Access  | Description                                                    |
| :------- | :----- | :------ | :------------------------------------------------------------- |
| `/`      | `POST` | Patient | Record/upload patient health data (vitals, measurements, etc.) |
| `/`      | `GET`  | Patient | Get logged-in patient's health data records                    |

---

## 📋 Medical Reports (`/medical-reports`)

| Endpoint | Method | Access  | Description                             |
| :------- | :----- | :------ | :-------------------------------------- |
| `/`      | `POST` | Patient | Upload/create a new medical report      |
| `/`      | `GET`  | Patient | Get logged-in patient's medical reports |

---

## 💳 Payments (`/payment`)

| Endpoint    | Method | Access  | Description                           |
| :---------- | :----- | :------ | :------------------------------------ |
| `/init`     | `POST` | Patient | Initialize a payment session (Stripe) |
| `/validate` | `GET`  | Public  | Validate/verify payment status        |

---

## ⭐ Reviews (`/reviews`)

| Endpoint | Method | Access  | Description                              |
| :------- | :----- | :------ | :--------------------------------------- |
| `/`      | `POST` | Patient | Create a review for a doctor             |
| `/`      | `GET`  | Public  | Get all reviews (can filter by doctorId) |

---

## 📊 Dashboard Metrics (`/meta`)

| Endpoint           | Method | Access | Description                                                   |
| :----------------- | :----- | :----- | :------------------------------------------------------------ |
| `/dashboard-stats` | `GET`  | Admin  | Get dashboard statistics and analytics                        |
| `/`                | `GET`  | Admin  | Get dashboard statistics and analytics (alternative endpoint) |

---

## 📝 API Request/Response Format

### Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errorDetails": {}
}
```

---

## 🔑 Authentication Token

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Token can be obtained from the `/auth/login` endpoint or refreshed using `/auth/refresh-token`.

---

## 📌 User Roles

- **Public**: No authentication required
- **Patient**: Requires Patient role authentication
- **Doctor**: Requires Doctor role authentication
- **Admin**: Requires Admin role authentication
- **User**: Requires any role authentication (Admin, Doctor, or Patient)

---

## 📸 File Upload Endpoints

The following endpoints support file uploads (multipart/form-data):

- `POST /user/create-patient` - Patient profile picture
- `POST /user/create-admin` - Admin profile picture
- `POST /user/create-doctor` - Doctor profile picture
- `PATCH /user/update-my-profile` - Updated profile picture
- `POST /specialties/` - Specialty image

---

## 🔗 Related Resources

For more details on implementation, see:

- [Backend Routes](./src/app/routes/index.ts)
- [Auth Routes](./src/app/modules/Auth/auth.routes.ts)
- [User Routes](./src/app/modules/user/user.routes.ts)
- [Prisma Schema](./prisma/schema/)

## 📊 Patient Health Data (`/patient-health-data`)

| Endpoint | Method | Access         | Description                  |
| :------- | :----- | :------------- | :--------------------------- |
| `/`      | `POST` | Patient        | Create or update health data |
| `/`      | `GET`  | Patient/Doctor | Get patient's health data    |

---

## 📄 Medical Reports (`/medical-reports`)

| Endpoint | Method | Access         | Description                   |
| :------- | :----- | :------------- | :---------------------------- |
| `/`      | `POST` | Patient        | Upload a new medical report   |
| `/`      | `GET`  | Patient/Doctor | Get patient's medical reports |

---

## 📈 Meta & Analytics (`/meta`)

| Endpoint | Method | Access               | Description                   |
| :------- | :----- | :------------------- | :---------------------------- |
| `/`      | `GET`  | Admin/Doctor/Patient | Get dashboard meta statistics |

---

> [!NOTE]
> All protected endpoints require a valid `Authorization` header with a Bearer token: `Bearer <AccessToken>`.

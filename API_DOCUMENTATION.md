# LifeCare Portal API Documentation 📑

**Base URL**: `http://localhost:5000/api/v1`

---

## 🔐 Authentication (`/auth`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `POST` | Public | Login with email and password |
| `/refresh-token` | `POST` | Public | Get a new access token using a refresh token |
| `/change-password` | `POST` | User | Change current user password |
| `/forgot-password` | `POST` | Public | Request a password reset link |
| `/reset-password` | `POST` | Public | Reset password using a reset token |

---

## 👤 User Management (`/user`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/create-patient` | `POST` | Public | Register a new patient account |
| `/create-admin` | `POST` | Admin | Create a new admin account |
| `/create-doctor` | `POST` | Admin | Create a new doctor account |
| `/me` | `GET` | User | Get logged-in user's profile |
| `/update-my-profile` | `PATCH` | User | Update logged-in user's profile |

---

## 🏨 Specialties (`/specialties`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Public | Get all medical specialties |
| `/` | `POST` | Admin | Create a new specialty |
| `/:id` | `DELETE` | Admin | Delete a specialty |

---

## 👨‍⚕️ Doctors (`/doctor`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Public | List all doctors with filtering and sorting |
| `/:id` | `GET` | Public | Get details of a specific doctor |
| `/:id` | `PATCH` | Admin/Doctor | Update doctor information |
| `/suggest` | `POST` | Public | Get AI-powered doctor suggestions |
| `/:id/specialties` | `POST` | Admin/Doctor | Add a specialty to a doctor |
| `/:id/specialties/:sid`| `DELETE` | Admin/Doctor | Remove a specialty from a doctor |

---

## 📅 Scheduling (`/schedule` & `/doctor-schedule`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/schedule` | `GET` | User | Get all schedules |
| `/schedule` | `POST` | Admin | Create a new schedule block |
| `/doctor-schedule` | `POST` | Doctor | Doctor books a schedule slot |
| `/doctor-schedule` | `GET` | User | Get all doctor schedules |
| `/doctor-schedule/my-schedule` | `GET` | Doctor | Get logged-in doctor's schedules |

---

## 🗓️ Appointments (`/appointment`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Patient | Book a new appointment |
| `/my-appointments` | `GET` | Patient/Doctor| Get logged-in user's appointments |

---

## 💊 Prescriptions (`/prescription`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Doctor | Create a new prescription |
| `/my-prescriptions` | `GET` | Patient/Doctor| Get logged-in user's prescriptions |

---

## 💳 Payments (`/payment`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/init` | `POST` | Patient | Initialize a payment (Stripe) |
| `/verify` | `POST` | Patient | Verify a payment status |

---

## ⭐ Reviews (`/reviews`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Patient | Create a review for a doctor |
| `/` | `GET` | Public | Get all reviews (can filter by doctorId) |

---

## 📊 Patient Health Data (`/patient-health-data`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Patient | Create or update health data |
| `/` | `GET` | Patient/Doctor| Get patient's health data |

---

## 📄 Medical Reports (`/medical-reports`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Patient | Upload a new medical report |
| `/` | `GET` | Patient/Doctor| Get patient's medical reports |

---

## 📈 Meta & Analytics (`/meta`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Admin/Doctor/Patient | Get dashboard meta statistics |

---

> [!NOTE]
> All protected endpoints require a valid `Authorization` header with a Bearer token: `Bearer <AccessToken>`.

# LifeCare Portal API Documentation

## Base URL
`http://localhost:3000/api/v1`

---

## 🔐 Authentication
*... (Previous Auth, User, Doctor, Appointment, Payment, Prescription sections remain unchanged - omitting for brevity unless requested to be full)*

*(New Sections)*

## ⭐ Reviews

### Create Review (Patient Only)
- **Method:** `POST`
- **URL:** `/reviews`
- **Headers:** `Authorization: <AccessToken>`
- **Body (JSON):**
  ```json
  {
    "doctorId": 12,
    "rating": 4.5, // Float
    "comment": "Great doctor!"
  }
  ```

### Get Reviews
- **Method:** `GET`
- **URL:** `/reviews`
- **Query Params:** `doctorId`

---

## 🏥 Patient Health Data

### Update/Create Health Data (Patient Only)
- **Method:** `POST`
- **URL:** `/patient-health-data`
- **Headers:** `Authorization: <AccessToken>`
- **Body (JSON):**
  ```json
  {
    "bloodGroup": "O+",
    "height": "175 cm",
    "weight": "70 kg",
    "allergies": "Peanuts",
    "hasDiabetes": false,
    "smokingStatus": false,
    "recentAnxiety": true
  }
  ```

### Get My Health Data
- **Method:** `GET`
- **URL:** `/patient-health-data`
- **Headers:** `Authorization: <AccessToken>`

---

## 📄 Medical Reports

### Add Medical Report (Patient Only)
- **Method:** `POST`
- **URL:** `/medical-reports`
- **Headers:** `Authorization: <AccessToken>`
- **Body (JSON):**
  ```json
  {
    "reportName": "Blood Test Result",
    "reportLink": "https://cloudinary.com/..."
  }
  ```

### Get My Reports
- **Method:** `GET`
- **URL:** `/medical-reports`
- **Headers:** `Authorization: <AccessToken>`

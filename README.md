# LifeCare Portal Server 🏥

LifeCare Portal Server is a robust, scalable, and feature-rich backend system designed for healthcare management. It enables patient registration, doctor scheduling, appointment booking, real-time communication, and secure payment processing.

## 🚀 Key Features

-   **User Management**: Role-based access control (Admin, Doctor, Patient).
-   **Authentication**: Secure JWT-based authentication with password reset and refresh token functionality.
-   **Doctor Scheduling**: Advanced scheduling system for doctors to manage availability.
-   **Appointment System**: Seamless booking and management of medical appointments.
-   **Real-time Chat**: Integrated messaging system using Socket.io for patient-doctor communication.
-   **Secure Payments**: Integrated Stripe payment gateway for consultation fees.
-   **Health Records**: Secure storage and management of patient health data and medical reports.
-   **Prescriptions & Reviews**: Digital prescriptions and verified patient review system.
-   **Media Handling**: Image and document management via Cloudinary.
-   **AI Integration**: OpenAI powered features for enhanced healthcare insights.

## 🛠️ Tech Stack

-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **Real-time**: [Socket.io](https://socket.io/)
-   **Payment**: [Stripe](https://stripe.com/)
-   **Storage**: [Cloudinary](https://cloudinary.com/)
-   **Validation**: [Zod](https://zod.dev/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (Version >= 22.13.0)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [PostgreSQL](https://www.postgresql.org/) database

## ⚙️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Emtiaz-ahmed-13/lifecare_portal_server.git
    cd lifecare_portal_server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://username:password@localhost:5432/lifecare_db"
    
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRES_IN=1h
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRES_IN=90d
    
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    
    STRIPE_SECRET_KEY=your_stripe_secret
    ```

4.  **Database Setup:**
    ```bash
    npm run db:generate
    npm run db:push
    npm run db:seed
    ```

## 🏃 Running the Application

-   **Development Mode:**
    ```bash
    npm run dev
    ```

-   **Production Build:**
    ```bash
    npm run build
    npm start
    ```

## 📜 Available Scripts

-   `npm run build`: Compiles TypeScript to JavaScript.
-   `npm start`: Runs the production build.
-   `npm run dev`: Starts the development server with live reload.
-   `npm run db:generate`: Generates Prisma Client.
-   `npm run db:migrate`: Deploys database migrations.
-   `npm run db:seed`: Seeds the database with initial data.

## 📄 API Documentation

You can find the API documentation in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

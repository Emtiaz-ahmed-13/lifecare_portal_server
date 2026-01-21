import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,

    jwt: {
        access_secret: process.env.ACCESS_TOKEN_SECRET as string,
        access_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
        refresh_secret: process.env.REFRESH_TOKEN_SECRET as string,
        refresh_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || "90d",
        reset_password_secret: process.env.RESET_PASSWORD_TOKEN_SECRET || "reset-token-secret",
        reset_password_expires_in: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN || "10m",
    },

    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    email: process.env.EMAIL,
    appPass: process.env.APP_PASS,
};

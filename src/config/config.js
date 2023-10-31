import dotenv from 'dotenv';

dotenv.config()

export const config = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    keySecret: process.env.KEY_SECRET,
    idClient: process.env.ID_CLIENT,
    keySecretClient: process.env.KEY_SECRET_CLIENT,
    callbackUrl: process.env.CALLBACK_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: process.env.PERSISTENCE
}
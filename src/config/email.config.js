import nodemailer from "nodemailer";
import { config } from "./config.js";

//configuracion transporte para enviar mensajes con gmail
export const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    auth:{
        user: config.ecommerceEmail,
        pass: config.ecommercePass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});
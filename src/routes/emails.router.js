import { Router } from "express";
import { sendEmailController } from "../controllers/emails.controllers.js";

const router = Router();

//ruta para enviar el correo
router.post("/", sendEmailController);

export { router as emailRouter };
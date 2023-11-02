import mongoose from "mongoose";
import { config } from "./config.js";
import { CustomError } from "../services/error/customError.services.js";
import { EError } from "../enums/EError.js";

export const connectDB = async () => {
	try {
		await mongoose.connect(config.mongoUrl);
		console.log("Conectado a la base datos MONGO DB");
	} catch (error) {
		const errorMessage = `Hubo un error al conectar la base de datos: ${error.message}`;
		CustomError.createError({
			name: "Error en la conxion de la base de datos",
			cause: errorMessage,
			message: "Hubo un error en la conexión",
			errorCode: EError.DATABASE_ERROR,
		});
	}
};
import multer from "multer";
import path from 'path'
import { __dirname } from "../utils.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const documentsFolder = path.join(__dirname, '/public/documents');
        cb(null, documentsFolder);

    },
    filename: (req, file, cb) => {
      // Generamos un nombre único para el archivo
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
    });

export const upload = multer({ storage: storage });
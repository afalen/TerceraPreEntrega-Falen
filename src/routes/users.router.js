import { Router } from "express";
import { UserController } from "../controllers/users.controllers.js";
import { checkRoles, checkUserAuthenticatedView } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// Ruta para mostrar todos los usuarios registrados
router.get("/", UserController.get);

// Ruta para obtener un usuario mediante su email
router.get('/email', UserController.getUserByEmail)

//Ruta para cambiar de roles de 'user' a 'premium' o viceversa
router.put("/premium/:uid", checkUserAuthenticatedView, UserController.changeRol);

// Ruta para cargar los docuementos de un usuario
router.post("/:uid/documents", upload.array('documents'), UserController.updateDocuments);

// Ruta para eliminar un determinado usuario
router.delete("/:uid", UserController.deleteUser)

// Ruta para eliminar a los todos usuarios inactivos
router.delete("/", UserController.deleteUsers);

export { router as userRouter };
import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { checkRoles, checkUserAuthenticatedView } from "../middlewares/auth.js";

const router = Router();

router.get("/", UserController.get);

//Ruta para cambiar de roles de 'user' a 'premium'
router.get("/premium/:uid", checkUserAuthenticatedView, UserController.changeRol);

export { router as userRouter };
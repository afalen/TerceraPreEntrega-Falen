import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";

const router = Router();

router.get("/", UserController.get);

export { router as userRouter };
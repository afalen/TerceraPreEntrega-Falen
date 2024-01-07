import { Router } from "express";
import { renderChat } from '../controllers/chats.controller.js'
import { checkRoles, checkUserAuthenticatedView } from "../middlewares/auth.js";

const router = Router()


router.get('/', checkUserAuthenticatedView ,checkRoles(['user', 'premium']) ,renderChat)


export { router as chatsRouter }

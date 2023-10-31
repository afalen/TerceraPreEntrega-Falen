import express from 'express';
import { ViewsController } from '../controllers/views.controllers.js';

const router = express.Router()

// Ruta que renderiza la vista de home
router.get("/", ViewsController.renderHome);

// Ruta que renderiza la vista del login
router.get("/login", ViewsController.renderLogin)

// Ruta que renderiza la vista del register
router.get("/register", ViewsController.renderRegister)


// Vista de productos
router.get('/products', ViewsController.getPaginationProducts)

// Vista de un carrito especificado por su ID
router.get('/carts/:cid', ViewsController.getCartById)

// Sessions

// Vista de profile del usuario
router.get("/profile", ViewsController.getProductsProfile)

// Destruir la session
router.get("/logout", ViewsController.logOut)

export { router as viewsRouter }
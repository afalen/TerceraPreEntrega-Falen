import express from 'express';
import { ViewsController } from '../controllers/views.controllers.js';
import { checkUserAuthenticatedView, showAuthView } from '../middlewares/auth.js';

const router = express.Router()

// Ruta que renderiza la vista de home
router.get("/", ViewsController.renderHome);

// Ruta que renderiza la vista del login
router.get("/login", showAuthView, ViewsController.renderLogin)

// Ruta que renderiza la vista del register
router.get("/register", showAuthView, ViewsController.renderRegister)

// Ruta que renderiza la vista para editar/modificar un producto
router.get('/products/:uid', checkUserAuthenticatedView, ViewsController.renderEdit)

// Vista de productos
router.get('/products', checkUserAuthenticatedView, ViewsController.getPaginationProducts)

// Vista de un carrito especificado por su ID
router.get('/carts/:cid', checkUserAuthenticatedView, ViewsController.renderCart)

// Vista de usuarios
router.get('/users', ViewsController.getUsers)

// Sessions

// Vista de profile del usuario
router.get("/profile", checkUserAuthenticatedView, ViewsController.getProductsProfile)

// Vista de permisos denegados
router.get("/denied", ViewsController.renderDenied)

// Destruir la session
router.get("/logout", ViewsController.logOut)

export { router as viewsRouter }
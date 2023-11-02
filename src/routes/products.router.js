import { Router } from 'express';
import { ProductsController } from '../controllers/products.controllers.js';
import { checkRoles, checkUserAuthenticatedView  } from '../middlewares/auth.js';

const router = Router()

// Ruta para mostrar productos de acuerdo a las querys ingresadas
router.get('/', ProductsController.getProducts)

// Ruta para mostrar un producto especificado por su ID
router.get('/:pid', ProductsController.getProductsById);

// Ruta para agregar un nuevo producto
router.post('/', checkUserAuthenticatedView, checkRoles(['admin']), ProductsController.addProduct)

// Ruta para modificar/actualizar un producto por su ID
router.put('/:uid', checkUserAuthenticatedView, checkRoles(['admin']), ProductsController.modifyProduct)

// Ruta para eliminar un producto por su ID
router.delete('/:uid', checkUserAuthenticatedView, checkRoles(['admin']), ProductsController.deleteProduct)

export { router as productsRouter }
import { Router } from 'express';
import { ProductsController } from '../controllers/products.controllers.js';

const router = Router()

// Ruta para mostrar productos de acuerdo a las querys ingresadas
router.get('/', ProductsController.getProducts)

// Ruta para mostrar un producto especificado por su ID
router.get('/:pid', ProductsController.getProductsById);

// Ruta para agregar un nuevo producto
router.post('/', ProductsController.addProduct)

// Ruta para modificar/actualizar un producto por su ID
router.put('/:uid', ProductsController.modifyProduct)

// Ruta para eliminar un producto por su ID
router.delete('/:uid', ProductsController.deleteProduct)

export { router as productsRouter }
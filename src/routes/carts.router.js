import { Router } from 'express';
import { CartsController } from '../controllers/carts.controllers.js';
import { checkRoles, checkUserAuthenticatedView  } from '../middlewares/auth.js';

const router = Router()

// Ruta para agregar un nuevo carrito
router.post('/', CartsController.createCart);

// Ruta para mostrar los productos de un carrito especificado por su ID
router.get('/:cid', CartsController.getCartById);

// Ruta para agregar productos a un carrito especificado
router.post('/:cid/product/:pid', checkUserAuthenticatedView, checkRoles(['user', 'premium']), CartsController.addProductsInCartById);

// Ruta para eliminar un determinado producto de un carrito
router.delete('/:cid/products/:pid', checkUserAuthenticatedView, checkRoles(['user', 'premium']),  CartsController.deleteProductInCart)

// Ruta para actualizar/reemplazar los productos de un carrito
router.put('/:cid', CartsController.modifyProductsInCart)

// Ruta para modificar los ejemplares de un producto determinado en un carrito
router.put('/:cid/products/:pid', CartsController.modifyQuantityInProductInCart)

router.post("/:cid/purchase", CartsController.purchase);

// Ruta para eliminar todos los productos del carrito especificado
router.delete('/:cid', CartsController.deleteProductsInCart)

export { router as cartsRouter }
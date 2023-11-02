import { cartsDao } from '../dao/factory.js'

export class CartsService {
    static async createCart(){
        return cartsDao.createCart();
    }

    static async getCartById(id){
        return cartsDao.getCartById(id);
    }

    static async addProductsInCartById(id_cart, id_product){
        return cartsDao.addProductsInCartById(id_cart, id_product);
    }

    static async deleteProductInCart(id_cart, id_product){
        return cartsDao.deleteProductInCart(id_cart, id_product);
    }

    static async modifyProductsInCart(id, productsNews){
        return cartsDao.modifyProductsInCart(id, productsNews);
    }

    static async modifyQuantityInProductInCart(id_cart, id_product, quantity){
        return cartsDao.modifyQuantityInProductInCart(id_cart, id_product, quantity);
    }

    static async deleteProductsInCart(id){
        return cartsDao.deleteProductsInCart(id);
    }

	static async purchase(cid, email) {
		return cartsDao.purchase(cid, email);
	}    
}




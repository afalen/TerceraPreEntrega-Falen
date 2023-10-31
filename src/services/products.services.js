import { productsDao } from '../dao/factory.js'

export class ProductsService {
    static async getProducts (limit, page, sort, query) {
        return productsDao.getProducts(limit, page, sort, query);
    }
    
    static async getProductsById   (id) {
        return productsDao.getProductsById(id);
    }
    
    static async addProduct(newProduct) {
        return productsDao.addProduct(newProduct);
    }
    
    static async modifyProduct(id, updates) {
        return productsDao.modifyProduct(id, updates);
    }
    
    static async deleteProduct(id) {
        return productsDao.deleteProduct(id);
    }
}
import productModel from '../models/products.model.js';

export class View{
    static async getPaginationProducts(limit, page){
        try{
            const result = await productModel.paginate({}, {limit: limit, page: page, lean: true});
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${result.limit}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${result.limit}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages)
            return result
        }catch(error){
            console.error(error)
            return null
        }
    } 

    static async getProductsProfile(first_name, last_name, email, age, role, cart){
        try{
            const result = await productModel.paginate({}, {lean: true});
            result.first_name = first_name,
            result.last_name = last_name,
            result.email = email,
            result.age = age,
            result.role = role,
            result.cart = cart,
            result.isAdmin = role === "admin" 
            return result
        }catch(error){
            console.error(error)
            return null
        }
        
    }
}


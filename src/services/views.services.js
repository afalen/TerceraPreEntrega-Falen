import { View } from '../dao/mongo/views.mongo.js'
import { Product } from '../dao/mongo/products.mongo.js'

export class ViewsService {

    static async renderProduct(id){
        return Product.getProductsById(id)
    }

    static async getPaginationProducts (limit, page) {
        return View.getPaginationProducts(limit, page)
    }
    
    static async renderCart (id) {
        return View.renderCart(id)
    }
    
    static async getProductsProfile (first_name, last_name, email, age, role, cart, hasImgProfile, ImgProfile) {
        return View.getProductsProfile(first_name, last_name, email, age, role, cart, hasImgProfile, ImgProfile)
    }


    static async getUsers (){
        return View.getUsers()
    }
}



import { View } from '../dao/mongo/views.mongo.js'
import { Cart } from '../dao/mongo/carts.mongo.js'

export class ViewsService {

    static async getPaginationProducts (limit, page) {
        return View.getPaginationProducts(limit, page)
    }
    
    static async getCartById (id) {
        return Cart.getCartById(id)
    }
    
    static async getProductsProfile (first_name, last_name, email, age, role, cart) {
        return View.getProductsProfile(first_name, last_name, email, age, role, cart)
    }

}



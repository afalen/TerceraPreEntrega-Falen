import cartModel from '../models/carts.model.js'
import productsModel from '../models/products.model.js'
import { UserModel } from '../models/user.model.js'
import { ticketsModel } from '../models/tickets.model.js' 

export class Cart {
    
    static async createCart(){
        try{
            let result = await cartModel.create({})
            return result
        }catch(error){
            console.error(error)
            return null
        }
    }

    static async getCartById(id){
        try{
            let cart = await cartModel.findById(id).lean(true)
            return cart
        }catch(error){
            console.error(error)
            return null
        }
    }

    static async addProductsInCartById(id_cart, id_product){
        try{
            let cart = await cartModel.findById(id_cart)
            let product = cart.products
            let productInsert = product.find( (product)=>product.product == id_product)
            if(productInsert){ // si el producto ya se encuentra en el carrito, aumenta en una unidad
                productInsert.quantity += 1;
            }else{
                cart.products.push({product: id_product})
            }
            let result = await cartModel.updateOne({_id: id_cart}, cart)
            return result
        }catch(error){
            console.error(error)
        }
    }

    static async deleteProductInCart(id_cart, id_product){
        try{
            let cart = await cartModel.findById(id_cart)
            let product = cart.products
            let productsNew = product.filter( (prod)=> prod.product != id_product) // array filtrado

            let result = await cartModel.updateOne({_id: id_cart}, {$set: {products: productsNew}})  
            return result
        }catch(error){
            console.error(error)
        }
    }

    static async modifyProductsInCart(id, productsNews){
        try{
            let cart = await cartModel.findById(id)
            let result = await cartModel.updateOne({_id: id}, {$set: {products: productsNews}})
            return result
        }catch(error){
            console.error(error)
        }
    }

    static async modifyQuantityInProductInCart(id_cart, id_product, quantity){
        try{
            let cart = await cartModel.findById(id_cart)
            let product = cart.products
            let newProduct = product.findIndex( (prod) => prod.product == id_product)
            product[newProduct].quantity = quantity
            let result = await cartModel.updateOne({_id: id_cart}, cart)
            return result
        }catch(error){
            console.error(error)
        }
    }

    static async deleteProductsInCart(id){
        try{
            let cart = await cartModel.findById(id)
            let product = cart.products
            product.splice(0, product.length)
            let result = await cartModel.updateOne({_id: id}, cart)
            return result
        }catch(error){
            console.error(error)
        }
    }

    static async deleteCart(id){
        try{
            let cart = await cartModel.findById(id)
            let result = await cartModel.deleteOne({_id: id})
            return result
        }catch(error){
            console.error(error)
        }
    }

    static async purchase(cid, email) {
		try {
			const productsApproved = [];
			const productsRejected = [];
            const productsDetail = [] // este array sirve para guardar los productos que se van a mostrar en el email
			let fullPurchase = 0;

			// Verificar que el carrito exista
			const cart = await cartModel.findById(cid);
			if (!cart) {
				throw new Error("El carrito no existe");
			}
			if (!cart.products.length) {
				throw new Error("El carrito no tiene productos");
			} else {
				for (let i = 0; i < cart.products.length; i++) {
					const productCart = cart.products[i].product;
                    const productDB = await productsModel.findById(productCart);
                    let comparison = parseInt(productDB.stock) - cart.products[i].quantity;

                    let productEmail = {
                        nombre: productDB.nombre,
                        precio: productDB.precio * cart.products[i].quantity,
                        quantity: cart.products[i].quantity
                    }
                    productsDetail.push(productEmail)
					if (comparison >= 0) {
						productsApproved.push(cart.products[i]);
						fullPurchase += productDB.precio * cart.products[i].quantity;
						//console.log(fullPurchase);

						productDB.stock = comparison;
						//console.log(productDB);
						await productsModel.findByIdAndUpdate(productCart, {
							stock: comparison,
						});
					} else {
						productsRejected.push(cart.products[i]);
					}
				}

				if (productsApproved.length > 0 && productsRejected.length === 0) {
					const user = await UserModel.findOne({email: email});
                    const ticketData = {
						purchase_datetime: Date(),
						amount: fullPurchase,
						purchaser: user.email,
					};

					const ticketCreated = await ticketsModel.create(ticketData);

                    //console.log(productsDetail)
					return { ticket: ticketCreated, total: fullPurchase, cart: productsDetail};
				} else if (productsRejected.length > 0) {
					// Si hay productos rechazados
					//return productsRejected
                    throw new Error(
						"Hay productos que no cuentan con el stock suficiente para generar tu compra"
					);
				} else {
					// Si no hay productos rechazados y no hay productos aprobados
					throw new Error("No hay productos aprobados para generar la compra");
				}
			}
		} catch (error) {
            console.log(error)
			throw new Error(`Error al procesar la compra ${error.message}`);
		}
	}    

}

import productModel from '../models/products.model.js';
import cartModel from '../models/carts.model.js';
import { UserModel } from '../models/user.model.js'

export class View{
    static async getPaginationProducts(limit, page){
        try{
            const result = await productModel.paginate({}, {limit: limit, page: page, lean: true});
            result.prevLink = result.hasPrevPage ? `https://tercerapreentrega-falen-production.up.railway.app/products?page=${result.prevPage}&limit=${result.limit}` : '';
            result.nextLink = result.hasNextPage ? `https://tercerapreentrega-falen-production.up.railway.app/products?page=${result.nextPage}&limit=${result.limit}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages)
            return result
        }catch(error){
            console.error(error)
            return null
        }
    } 

    static async getProductsProfile(first_name, last_name, email, age, role, cart, hasImgProfile, ImgProfile, documents, isPremium){
        try{
            //const result = await productModel.paginate({}, {lean: true});
            const result = {}
            const products = await productModel.find().lean(true)
            result.first_name = first_name,
            result.last_name = last_name,
            result.email = email,
            result.age = age,
            result.role = role,
            result.cart = cart,
            result.hasImgProfile = hasImgProfile,
            result.ImgProfile = ImgProfile,
            result.products = products
            if(role === "admin" || role === "premium"){
                result.isAdmin = true
                if(role === "admin") result.logAdmin = true
                else result.logAdmin = false
            }else{
                result.isAdmin = false
            }
            //console.log(result)
            return result
        }catch(error){
            console.error(error)
            return null
        }
        
    }


    static async renderCart(id){
        try{
            let cart = await cartModel.findById(id).lean(true)

            let productsRender = []
            let totalCompra = 0
            for (let index = 0; index < cart.products.length; index++) {
                let productData = await productModel.findById(cart.products[index].product)
                let newProduct = {
                    id_cart: id,
                    _id: cart.products[index].product,
                    nombre: productData.nombre,
                    precio: productData.precio * cart.products[index].quantity,
                    imagen: productData.imagen,
                    quantity: cart.products[index].quantity,
                    hasUrlImg: productData.hasUrlImg,
                    hasImgProducts: productData.hasImgProducts,
                    ImgProduct: productData.ImgProduct
                }
                totalCompra += newProduct.precio
                productsRender.push(newProduct)
            }
            

            const cartWithProducts = {
                _id: id,
                products: productsRender,
                total: totalCompra
            }
            return cartWithProducts
        }catch(error){
            console.error(error)
            return null
        }

    }

    static async getUsers() {
        try {
            const user = await UserModel.find().lean(true);
            return user;
        } catch (error) {
            throw new Error("No se pudieron obtener los Usuarios");
        }
    }



}


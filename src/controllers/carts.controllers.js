import { CartsService } from "../services/carts.services.js";
import { ProductsService } from '../services/products.services.js'
import { sendEmailController } from "./emails.controllers.js";
import { CustomError } from "../services/error/customError.services.js";
import { generateCartErrorParams } from "../services/error/cartErrorParams.services.js"
import { EError } from "../enums/EError.js";
import { errorLoger } from "../utils/logger.js";

export class CartsController {
    static createCart = async(req, res)=>{
        try{
            let resultado = await CartsService.createCart({})
            res.send({result: 'success', payload: resultado})
        }catch(error){  
			res.json({ status: "error", message: error.message });
        }
    } 
    
    static getCartById = async(req, res)=>{
        try{
            const {cid} = req.params
            if (!cid || cid.trim() === "") {
                errorLoger.error("Error al crear un carrito")
                CustomError.createError({
                    name: "Error id carrito",
                    cause: generateCartErrorParams(cid),
                    message: "Error al obtener el carrito",
                    errorCode: EError.INVALID_PARAMS,
                });
            }
            let resultado = await CartsService.getCartById(cid)
            res.send({result: 'success', payload: resultado})
        }catch(error){
            res.json({ status: "error", message: error.message });
        }
    }
    
    static addProductsInCartById = async(req, res)=>{
        try{
            const {cid, pid} = req.params
            let product = await ProductsService.getProductsById(pid)
            if(product.owner == req.user.email){
                res.send({result: 'error', message: "No puedes agregar un producto que ha sido creado por usted"}) 
            }else{
                let resultado = await CartsService.addProductsInCartById(cid, pid)
                res.send({result: 'success', payload: resultado}) 
            }
        }catch(error){
            throw new Error(`Error al visualizar los productos del carrito ${error.message}`);
        }
    }
    
    static deleteProductInCart = async(req, res)=>{
        try{
            const {cid, pid} = req.params
            await CartsService.deleteProductInCart(cid, pid)
            res.redirect(`/carts/${cid}`)
            //res.send({result: 'success', payload: resultado}) 
        }catch(error){
            throw new Error(`Error al eliminar los productos del carrito ${error.message}`);
        }
    }
    
    static modifyProductsInCart = async(req, res)=>{
        try{
            const {cid} = req.params
            const newsProducts = req.body
            let resultado = await CartsService.modifyProductsInCart(cid, newsProducts)
            res.send({result: 'success', payload: resultado}) 
        }catch(error){
            throw new Error(`Error al modificar los productos del carrito ${error.message}`);
        }
    }
    
    static modifyQuantityInProductInCart = async(req, res)=>{
        try{
            const {cid, pid} = req.params
            const newQuantity = req.body.quantity
            let resultado = await CartsService.modifyQuantityInProductInCart(cid, pid, newQuantity)
            res.send({result: 'success', payload: resultado}) 
        }catch(error){
            throw new Error(`Error al modificar la cantidad de ejemplares de un producto del carrito ${error.message}`);
        }
    }
    
    static deleteProductsInCart = async(req, res)=>{
        try{
            const {cid} = req.params
            let resultado = await CartsService.deleteProductsInCart(cid)
            res.send({result: 'success', payload: resultado}) 
        }catch(error){
            throw new Error(`Error al eliminar los productos del carrito ${error.message}`);
        }
    }

    static deleteCart = async(req, res)=>{
        try{
            const {cid} = req.params
            let resultado = await CartsService.deleteCart(cid)
            res.send({result: 'success', payload: resultado}) 
        }catch(error){
            throw new Error(`Error al eliminar el carrito ${error.message}`);
        }
    }


    static purchase = async (req, res) => {
		try {
			const { cid } = req.params;
            const { email } = req.session.user
            const result = await CartsService.purchase(cid, email);
            await CartsService.deleteProductsInCart(cid)
			await sendEmailController(email, result)
            //res.json({ status: "success", data: cartPurchase });
            res.redirect('/profile')
		} catch (error) {
			res.json({ status: "error", message: error.message });
		}
	};

}
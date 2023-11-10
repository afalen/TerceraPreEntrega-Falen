import { ProductsService } from '../services/products.services.js'
import { EError } from '../enums/EError.js'
import { CustomError } from '../services/error/customError.services.js'
import { generateProductError } from '../services/error/productError.services.js'
import { errorLoger } from '../utils/logger.js'

export class ProductsController {

    static getProducts = async(req, res)=>{
        try{
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const sort = parseInt(req.query.sort)
            const query = req.query.query 
            let resultado = await ProductsService.getProducts(limit, page, sort, query)
            res.send({result: 'success', payload: resultado})
        }catch(error){
            throw new Error(`Error al visualizar los productos ${error.message}`);
        }
    }
    
    static getProductsById = async(req, res)=>{
        try{
            const {pid} = req.params
            let product = await ProductsService.getProductsById(pid)
            res.send({result: 'success', payload: product})
        }catch(error){
            throw new Error(`Error al visualizar el producto ${error.message}`);
        }
    }
    
    static addProduct = async(req, res)=>{
        try{
            let newProduct = req.body;
            if (!newProduct) {
                errorLoger.error("Error al agregar un producto")
                CustomError.createError({
                    name: "Error al crear el producto",
                    cause: generateProductError(req.body),
                    message: "Hubo un error al agregar un producto",
                    errorCode: EError.INVALID_JSON,
                });
            }
        
            await ProductsService.addProduct(newProduct)
            res.redirect("/profile")
            //res.send({result: "success", payload: result})
        }catch(error){
            res.json({ status: "error", message: error.message });
        }
    }
    
    static modifyProduct = async(req, res)=>{
        try{
            let {uid} = req.params
            let {nombre, categoria, precio, stock, imagen} = req.body
            if(!nombre || !categoria || !precio || !stock || !imagen){
                res.send({status:'error', error:'Faltan parámetros'})
            }
        
            await ProductsService.modifyProduct(uid, {nombre, categoria, precio, stock, imagen})
            res.redirect("/profile")
           // res.send({result: 'success', payload: result})
        }catch(error){
            throw new Error(`Error al modificar el producto ${error.message}`);
        }
    }
    
    static deleteProduct = async(req, res)=>{
        try{
            let {uid} = req.params
            await ProductsService.deleteProduct(uid)
            res.redirect("/profile")
           // res.send({result: "success", payload: result})
        }catch(error){
            throw new Error(`Error al eliminar el producto ${error.message}`);
        }
    }

}




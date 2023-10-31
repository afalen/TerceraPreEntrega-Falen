import { ProductsService } from '../services/products.services.js'

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
            if(!newProduct){
                res.send({status: "error", error: "Error en los parametros del producto"})
            }
        
            let result = await ProductsService.addProduct(newProduct)
            res.send({result: "success", payload: result})
        }catch(error){
            throw new Error(`Error al agregar el producto ${error.message}`);
        }
    }
    
    static modifyProduct = async(req, res)=>{
        try{
            let {uid} = req.params
            let productToReplace = req.body
            if(!productToReplace.nombre || !productToReplace.categoria || !productToReplace.precio || !productToReplace.stock || !productToReplace.imagen){
                res.send({status:'error', error:'Faltan parámetros'})
            }
        
            let result = await ProductsService.modifyProduct(uid, productToReplace)
            res.send({result: 'success', payload: result})
        }catch(error){
            throw new Error(`Error al modificar el producto ${error.message}`);
        }
    }
    
    static deleteProduct = async(req, res)=>{
        try{
            let {uid} = req.params
            let result = await ProductsService.deleteProduct(uid)
            res.send({result: "success", payload: result})
        }catch(error){
            throw new Error(`Error al eliminar el producto ${error.message}`);
        }
    }

}




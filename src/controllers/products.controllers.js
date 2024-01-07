import { ProductsService } from '../services/products.services.js'
import { EError } from '../enums/EError.js'
import { CustomError } from '../services/error/customError.services.js'
import { generateProductError } from '../services/error/productError.services.js'
import { errorLoger } from '../utils/logger.js'
import { transporter } from '../config/email.config.js';
import { config } from '../config/config.js';

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
            let img = false
            if(req.file) img = true;
            let newProd = {
                ...newProduct,
                hasUrlImg: (newProduct.imagen) ? true : false,
                hasImgProducts: img,
                ImgProduct: (img) ? req.file.filename : ""
            }

            if(req.user.role == "premium"){
                let newProductOwner = {
                    ...newProd,
                    owner: req.user.email
                }
                await ProductsService.addProduct(newProductOwner)
            }else{
                await ProductsService.addProduct(newProd)
            }
            res.redirect("/profile")
            //res.send({result: "success", payload: result})
        }catch(error){
            res.json({ status: "error", message: error.message });
        }
    }
    
    static modifyProduct = async(req, res)=>{
        try{
            let {uid} = req.params
            const product = await ProductsService.getProductsById(uid)
            let {nombre, categoria, precio, stock, imagen} = req.body
            if(!nombre || !categoria || !precio || !stock){
                res.send({status:'error', error:'Faltan parámetros'})
            }
            let img = false
            if(req.file) img = true;
            let hasUrlImg = (imagen) ? true : false
            let hasImgProducts = img
            let ImgProduct = (img) ? req.file.filename : ""

            if(product.owner == req.user.email){
                await ProductsService.modifyProduct(uid, {nombre, categoria, precio, stock, imagen, hasUrlImg, hasImgProducts, ImgProduct})
                res.redirect("/profile")
            }else{
                if(req.user.role == 'premium'){
                    res.redirect("/denied")
                }else if(req.user.role == 'admin'){
                    await ProductsService.modifyProduct(uid, {nombre, categoria, precio, stock, imagen, hasUrlImg, hasImgProducts, ImgProduct})
                    res.redirect("/profile")
                }
            }

           // res.send({result: 'success', payload: result})
        }catch(error){
            throw new Error(`Error al modificar el producto ${error.message}`);
        }
    }
    
    static deleteProduct = async(req, res)=>{
        try{
            let {uid} = req.params
            const product = await ProductsService.getProductsById(uid)

            if(product.owner == req.user.email){
                await ProductsService.deleteProduct(uid)
                res.redirect("/profile")
            }else{
                if(req.user.role == 'premium'){
                    res.redirect("/denied")
                }else if(req.user.role == 'admin'){
                    if(product.owner !== 'admin'){
                        const mailOptions = {
                            from: `Ecommerce Proyect ${config.adminEmail}`,
                            to: product.owner,
                            subject: 'Producto eliminado',
                            text: 'El producto creado por usted ha sido eliminado por el administrador.'
                        };
                        transporter.sendMail(mailOptions)
                    }
                    
                    await ProductsService.deleteProduct(uid)
                    res.redirect("/profile")
                }
            }
           // res.send({result: "success", payload: result})
        }catch(error){
            throw new Error(`Error al eliminar el producto ${error.message}`);
        }
    }

}




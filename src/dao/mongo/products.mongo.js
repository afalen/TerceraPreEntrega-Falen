import productModel from '../models/products.model.js'

export class Product{
    static async getProducts(limit, page, sort, query){
        try{
            let products
            if(!query && !sort){
                products = await productModel.paginate({}, {limit: limit, page: page })
            }else if(!query){
                products = await productModel.paginate({}, {limit: limit, page: page, sort: {precio: sort} })
            }else if(isNaN(query)){
                products = await productModel.paginate({categoria: query}, {limit: limit, page: page, sort: {precio: sort} })
            }else if(!isNaN(query)){
                products = await productModel.paginate({stock: Number(query)}, {limit: limit, page: page, sort: {precio: sort} })
            }
            return products
        }catch(error){
            console.error(error)
            return null
        }
    }

    static async getProductsById(id){
        try{
            let product = await productModel.findById(id)
            return product
        }catch(error){
            console.error(error)
            return null
        }
    }

    static async addProduct(newProduct){
        try{
            let result = await productModel.create(newProduct)
            return result
        }catch(error){
            console.error(error)
            return null
        }
    }

    static async modifyProduct(id, updates){
        try{
            let result = await productModel.updateOne({_id: id}, updates)
            return result
        }catch(error){
            console.error(error)
            return null
        }
    }

    static async deleteProduct(id){
        try{
            let result = await productModel.deleteOne({_id: id})
            return result
        }catch(error){
            console.error(error)
            return null
        }
    }

}

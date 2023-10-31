import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productColletion = 'products'

const productSchema = new mongoose.Schema({
    nombre: {type: String, require: true, max: 100},
    categoria: {type: String, require: true, max: 50},
    precio: {type: Number, require: true, max: 10000},
    stock: {type: Number, require: true, max: 100},
    imagen: {type: String, require: true, max: 200}
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productColletion, productSchema)

export default productModel;
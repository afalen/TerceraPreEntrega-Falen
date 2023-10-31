import mongoose from "mongoose";
import { config } from "../config/config.js";

let productsDao;
let cartsDao;
let usersDao;

switch (config.persistence) {
    case "MONGO":
        //conexion a base de datos
        const connection = mongoose.connect(config.mongoUrl)

        const {Cart} = await import("./mongo/carts.mongo.js");
        const {Product} = await import("./mongo/products.mongo.js");
        const {User} = await import("./mongo/users.mongo.js");
        cartsDao = Cart;
        productsDao = Product;
        usersDao = User;
        break;

    case "MEMORY":
        const {CartFiles} = await import("./memory/carts.memory.js");
        const {ProductsFiles} = await import ("./memory/products.memory.js");
        cartsDao = new CartFiles();
        productsDao = new ProductsFiles();
        break;

};


export {productsDao, cartsDao, usersDao};
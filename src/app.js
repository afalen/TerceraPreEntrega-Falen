import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import path from 'path';
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars';
import passport from 'passport';

const app = express()

// Config
import { config } from './config/config.js';
import { initializePassport } from './config/passport.config.js';

// Rutas
import { viewsRouter } from './routes/views.router.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { userRouter } from './routes/users.router.js';

app.listen(config.port, ()=>{
    console.log(`Server is running on port ${config.port}`)
})


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuración Handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use(express.static(path.join(__dirname, "/public")))


const enviroment = async()=>{
    await mongoose.connect(config.mongoUrl)

    console.log("Conectado a la base de datos")
}
enviroment()

// Configuración de la session
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        ttl: 1000
    }),
    secret: config.keySecret,
    resave: false,
    saveUninitialized: true
}))

// Configuración del passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', userRouter)
app.use('/', viewsRouter)
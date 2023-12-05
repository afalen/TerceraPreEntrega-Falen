import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import path from 'path';
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars';
import passport from 'passport';
import methodOveride from 'method-override';
import http from 'http'
import { Server } from 'socket.io'
import { chat } from './sockets.js';
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
chat(io)

// Config
import { config } from './config/config.js';
import { initializePassport } from './config/passport.config.js';
import { typeLogger } from './utils/logger.js';

// Rutas
import { viewsRouter } from './routes/views.router.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { userRouter } from './routes/users.router.js';
import { emailRouter } from './routes/emails.router.js';
import { chatsRouter } from './routes/chats.router.js';
import { mockingproductsRouter } from './routes/mockingproducts.router.js';
import { loggerRouter } from './routes/logger.router.js';

server.listen(config.port, ()=>{
    console.log(`Server is running on port ${config.port}`)
})


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(typeLogger)
// Este middleware sirve para usar un form con metodo POST Y DELETE
app.use(methodOveride('_method'))

// Configuracion para la documentacion
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentacion del Proyecto Ecommerce",
            description:"API de los productos disponibles en el ecommerce"
        }
    },
    apis: [`src/docs/Products/Products.yaml`, `src/docs/Carts/Carts.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));



// Configuración Handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use(express.static(path.join(__dirname, "/public")))

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
app.use('/chat', chatsRouter)
app.use('/', viewsRouter)
app.use('/enviar-email', emailRouter)
app.use('/mockingproducts', mockingproductsRouter)
app.use('/loggerTest', loggerRouter)

app.use(errorHandler);
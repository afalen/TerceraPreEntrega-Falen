import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

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
const serve = swaggerUiExpress.serve 
const setup = swaggerUiExpress.setup(specs)
export { serve , setup }
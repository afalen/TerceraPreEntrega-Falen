import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Testing Ecommerce', ()=>{
    describe('Test de products', ()=>{
        it('El endpoint GET /api/products trae todas los productos en formato de arreglo', async()=>{
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/products')

            expect(statusCode).to.be.equals(200)
            expect(ok).to.be.equals(true)
            expect(Array.isArray(_body.payload.docs)).to.be.equals(true)

        })

        
        it('El endpoint GET /api/products/:pid trae un producto en específico', async()=>{
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/products/654272656edd69dcb23f0d8d')
            
            expect(statusCode).to.be.equals(200)
            expect(ok).to.be.equals(true)
            expect(_body.payload._id).to.be.equals('654272656edd69dcb23f0d8d')
        }) 

        it('El endpoint GET /api/products/:pid trae un producto en específico en formato objeto', async()=>{
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/products/654272656edd69dcb23f0d8d')
            
            expect(statusCode).to.be.equals(200)
            expect(ok).to.be.equals(true)
            expect(_body.payload).to.be.an("object")

        }) 

    })


    describe('Test de Carts', ()=>{
        it('El endpoint POST /api/carts crea un nuevo carrito correctamente', async()=>{
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/carts')

            expect(statusCode).to.be.equals(200)
            expect(ok).to.be.equals(true)
            expect(_body).to.have.property('payload')
            const response = await requester.delete(`/api/carts/delete/${_body.payload._id}`)
            expect(response.statusCode).to.be.equals(200)
        })


        it('El endpoint GET /api/carts/:cid obtiene un nuevo carrito de acuerdo a su ID', async()=>{
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/carts')

            expect(statusCode).to.be.equals(200)
            expect(ok).to.be.equals(true)
            expect(_body).to.have.property('payload')
            const result = await requester.get(`/api/carts/${_body.payload._id}`)

            expect(result.statusCode).to.be.equals(200)
            expect(result.ok).to.be.equals(true)
            expect(result._body).to.have.property('payload')

            const response = await requester.delete(`/api/carts/delete/${_body.payload._id}`)
            expect(response.statusCode).to.be.equals(200)
        })

        it('El endpoint PUT /api/carts/:cid modifica los productos del carrito especificado por su ID', async()=>{
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/carts')

            expect(statusCode).to.be.equals(200)
            expect(ok).to.be.equals(true)
            expect(_body).to.have.property('payload')
            
            const newProducts = [
                {
                    product: "64ff8083d33444ef37e4d344",
                    quantity: 3
                },
                {
                    product: "64ff8083d33444ef37e4d345",
                    quantity: 4
                }
            ]

            const result = await requester.put(`/api/carts/${_body.payload._id}`).send(newProducts)
            expect(result.statusCode).to.be.equals(200)
            expect(result._body).to.have.property('payload')


            const result1 = await requester.get(`/api/carts/${_body.payload._id}`)
            //console.log(result1._body.payload.products)
            expect(Array.isArray(result1._body.payload.products) && result1._body.payload.products.length > 0).to.be.ok 

            const response = await requester.delete(`/api/carts/delete/${_body.payload._id}`)
            expect(response.statusCode).to.be.equals(200)
        })


    })



    describe('Test de Sessions', ()=>{
        let cookie
        it('El endpoint POST /api/sessions/register debe registrar un usuario correctamente con role user', async()=>{
            const userMock = {
                first_name: "Tito",
                last_name: "Mendez",
                email: "tito@email.com", 
                age: 22, 
                password: "2023"
            }

            const result = await requester.post('/api/sessions/register').send(userMock)
            expect(result.statusCode).to.be.equals(302)

            const emailMock = {
                email: 'tito@email.com'
            }

            const {ok, statusCode, _body} = await requester.get('/api/users/email').send(emailMock)
            expect(ok).to.be.equals(true)
            expect(statusCode).to.be.equals(200)
            expect(_body.data).to.have.property("role").to.be.equals('user')


        })


        it('El endpoint POST /api/sessions/login debe loguear un usuario correctamente y devolver una Cookie', async()=>{
            const userMock = {
                email: "tito@email.com", 
                password: "2023"
            }

            const result = await requester.post('/api/sessions/login').send(userMock)
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok
            expect(cookie.value).to.be.ok

        })

        it('El endopoint GET /api/sessions/current debe enviar la cookie que contiene el usuario y desestructurar correctamente', async()=>{
            const {_body} = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

            expect(_body.payload.email).to.be.eql('tito@email.com')
        })


    })
    
}) 
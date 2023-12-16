import passport from 'passport';
import local from 'passport-local';
import { UserModel } from '../dao/models/user.model.js';
import cartModel from '../dao/models/carts.model.js';
import { createHash, isValidatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import { config } from './config.js';


const LocalStrategy = local.Strategy

export const initializePassport = () =>{

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField:'email'},async(req,username,password,done)=>{
        const { first_name,last_name,email,age} = req.body
        try{
            let user = await UserModel.findOne({email:username})
            if(user){
                console.log("El usuario ya existe")
                return done(null,false)
            }
            let cartNew = await cartModel.create({})
            let img = false
            if(req.file) img = true
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cartNew._id,
                hasImgProfile: img,
                ImgProfile: (img) ? req.file.filename : ""
            }
            let result = await UserModel.create(newUser)
            return done(null,result)
        }catch(error){
            return done("Error al obtener usuario "+ error)
        }
    }))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done)=>{
        try{
            if(username === config.adminEmail && password === config.adminPassword){
                const adminUser = { _id: 'admin', role: 'admin' };
                return done(null, adminUser);
            }
            
            const user = await UserModel.findOne({email:username})

            if(!user){
                console.log("Usuario no encontrado")
                return done(null, false)
            }
            if(!isValidatePassword(user, password)) return done(null,false)
            return done(null, user)
        }catch(error){
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: config.idClient,
        clientSecret: config.keySecretClient,
        callbackURL: config.callbackUrl
        }, async (accessToken, refreshToken, profile, done)=>{
        try{
            let user = await UserModel.findOne({email: profile._json.email})
            if(!user){
                let cartNew = await cartModel.create({})
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: '',
                    cart: cartNew._id,
                }
        
                let result = await UserModel.create(newUser)
                done(null, result)
            }else{
                done(null, user)
            }
        }catch(error){
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        if(user._id === 'admin'){
            done(null, user._id)
        }else{
            done(null, user._id)
        }
    })
    
    passport.deserializeUser(async (id, done)=>{
        if(id === 'admin'){
            const adminUser = { _id: 'admin', role: 'admin' };
            done(null, adminUser)
        }else{
            let user = await UserModel.findById(id)
            done(null, user)
        }
    })

}
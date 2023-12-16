import { SessionsService } from '../services/sessions.services.js';
import { UserModel } from '../dao/models/user.model.js';
import { UserDto } from '../dao/dto/user.dto.js';
import { config }  from '../config/config.js';
import { transporter } from '../config/email.config.js';
import crypto from 'crypto'
import { createHash, isValidatePassword } from '../utils.js';

const tokenStore = {};

export class SessionsController {
        
    static register = async (req, res) => {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Faltan datos.');
        }
    
        res.redirect('/login');
    }
    

    static failRegister = async (req, res) => {
        console.log("Falla en autenticacion del register")
        res.send("Error. Ya hay un usuario registrado con esos datos")
    }
    
    static login = async (req, res) => {        
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).render("login", { error: "Valores erroneos" });

        const user = await SessionsService.getUser(email)
        //console.log(user)

        if (!user) {
            if(email === config.adminEmail && password === config.adminPassword){
                req.session.user = {
                    email: email,
                    role: "admin"
                }
                res.redirect("/profile");
            }else{
                return res.status(400).render("login", { error: "Usuario no encontrado" });
            }
        }else{
            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                role: user.role,
                hasImgProfile: user.hasImgProfile,
                ImgProfile: user.ImgProfile
            };
            await UserModel.findOneAndUpdate({ email }, { last_connection: new Date() });
            res.redirect("/profile"); 
        }
    }
    
    static failLogin = async(req,res)=>{
        console.log("Falla en autenticacion del login")
        res.send("No estás registrado o ingresaste un password incorrecto")
    }
    
    static githubCallback = async(req, res)=>{
        req.session.user = {role: "user", ...req.user._doc}
        res.redirect('/profile')
    }
    
    static current = (req, res)=>{

        if (!req.session.user) {
            return res.json({status:"error", error:"no está logueado"})
        }

        let userConected = new UserDto(req.session.user)

        res.json({status:"está logueado!", payload: userConected})
    }


    static forgot = (req, res)=>{
        res.render("forgot")
    }


    static forgotPassword = async(req, res)=>{
        let userInput = req.body;
        
        let user = await SessionsService.getUser(userInput.email)
        if (!user) {
            return res.status(404).send('Email no encontrado');
        }

        // Generar y almacenar un token único
        const token = crypto.randomBytes(20).toString('hex');
        tokenStore[token] = { userInput, createdAt: Date.now() };

       // console.log(tokenStore)
       // console.log(tokenStore[token].userInput.email)


        // Enviar correo electrónico con el enlace de restablecimiento
        const resetLink = `http://localhost:8080/api/sessions/reset-password?token=${token}`;
        const mailOptions = {
            from: `Ecommerce Proyect ${config.adminEmail}`,
            to: user.email,
            subject: 'Restablecimiento de contraseña',
            text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            return res.status(500).send('Error al enviar el correo electrónico');
            }
            res.send('Se ha enviado un correo electrónico con el enlace de restablecimiento');
        })
    }

    static reset = (req, res)=>{
        const { token } = req.query;

        // Verificar si el token existe
        const tokenInfo = tokenStore[token];
        if (!tokenInfo) {
            return res.status(404).send('Token no válido o expirado');
        }

        // Verificar si el token ha expirado (1 hora)
        const elapsedTime = Date.now() - tokenInfo.createdAt;
        if (elapsedTime > 60 * 60 * 1000) {
            delete tokenStore[token];
            return res.redirect('/generate_reset-link');
        }
        // Renderizar la página de restablecimiento de contraseña
        res.render('reset', {token});
    }


    static resetPassword = async(req, res)=>{
        const { token } = req.body;
        const { password } = req.body;

        // Verificar si el token existe
        const tokenInfo = tokenStore[token];

        if (!tokenInfo) {
            return res.status(404).send('Token no válido o expirado');
        }

        // Verificar si la nueva contraseña es diferente a la actual
        const user = await SessionsService.getUser(tokenStore[token].userInput.email)
        if (isValidatePassword(user,password)) {
            return res.status(400).send('No puedes utilizar la misma contraseña');
        }

        // Actualizar la contraseña en la base de datos 
        let userTest = await UserModel.findOne({email: tokenStore[token].userInput.email})
        let result = await UserModel.updateOne({_id: userTest._id}, {password: createHash(password)})
        //console.log(result)
        // Eliminar el token después de usarlo
        delete tokenStore[token];
    
        res.send('Contraseña restablecida con éxito');
    }



    static generateLink = (req, res)=>{
        res.send('Generar nuevamente el correo de restablecimiento con una nueva duración de 1 hora');
    }



}



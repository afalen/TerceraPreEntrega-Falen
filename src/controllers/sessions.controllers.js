import { SessionsService } from '../services/sessions.services.js';
import { UserDto } from '../dao/dto/user.dto.js';
import { config }  from '../config/config.js';

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
                role: user.role
            };
    
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
}



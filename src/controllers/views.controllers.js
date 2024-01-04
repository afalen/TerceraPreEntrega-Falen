import { ViewsService } from '../services/views.services.js'
import { UserDto } from '../dao/dto/user.dto.js';

export class ViewsController{
	static renderHome = (req, res) => {
		res.render("home");
	};

    static renderLogin = async(req,res) =>{
        try{
            res.render("login")
        }catch(error){
            throw new Error(`Error al renderizar el login ${error.message}`);
        }
    }
    
    static renderRegister = async (req, res) => {
        try{
            res.render("register")
        }catch(error){
            throw new Error(`Error al renderizar el register ${error.message}`);
        }
    }
    
    static renderEdit = async(req, res)=>{
        try{
            const {uid} = req.params
            const product = await ViewsService.renderProduct(uid)
            res.render("edit", product)
        }catch(error){
            throw new Error(`Error al renderizar el register ${error.message}`);
        }
    }

    static getPaginationProducts = async(req, res)=>{
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1 
    
            const result = await ViewsService.getPaginationProducts(limit, page)
            result.user = req.session.user
            res.render('products', result);
        } catch (error) {
            console.error('Error al recuperar productos:', error);
            res.status(500).send('Error al recuperar productos');
        }
    }
    
    static renderCart = async(req,res)=>{
        const {cid} = req.params
        let cart = await ViewsService.renderCart(cid)
        res.render('carts', cart)
    }
    
    static getProductsProfile = async (req, res) => {
        if (!req.session.user) {
            return res.redirect("/login")
        }
    
        const { first_name, last_name, email, age, role, cart, hasImgProfile, ImgProfile } = req.session.user
        const result = await ViewsService.getProductsProfile(first_name, last_name, email, age, role, cart, hasImgProfile, ImgProfile)
        res.render("profile", result)
    }
    

    static renderDenied = async(req, res)=>{
        try{
            res.render("denied")
        }catch(error){
            throw new Error(`Error al renderizar la vista ${error.message}`);
        }
    }

    static logOut = async (req, res) => {
        req.session.destroy(err =>{
            if(!err) res.redirect("/login")
            else res.send({status: 'Logout ERROR', body: err})
        })
    }

    static getUsers = async(req, res)=>{
        try {
			const users = await ViewsService.getUsers();
            const newUsers = users.map((user) => new UserDto(user));
            res.render('users', { newUsers })
		} catch (error) {
			res.json({ status: "error", message: error.message });
		}
    }

}


import { UsersService } from '../services/users.services.js';
import { UserDto } from '../dao/dto/user.dto.js';
import { transporter } from '../config/email.config.js';
import { config } from '../config/config.js';
import { UserModel } from '../dao/models/user.model.js';
import cartModel from '../dao/models/carts.model.js';
import moment from 'moment';

export class UserController {
	static async get(req, res) {
		try {
			const users = await UsersService.get();
			const newUsers = users.map((user) => new UserDto(user));
			res.json({ status: "success", data: newUsers });
		} catch (error) {
			res.json({ status: "error", message: error.message });
		}
	};

	static async getUserByEmail(req, res){
		try {
			const email = req.body.email
			const user = await UsersService.getUserByEmail(email);
			res.json({ status: "success", data: user });
		} catch (error) {
			res.json({ status: "error", message: error.message });
		}
	}


	static async changeRol(req, res){
		try {
			const {uid} = req.params
			const user = await UsersService.changeRol(uid);
			if(req.session.user.rol == 'admin')
			res.redirect("/users")
			else 
				res.redirect('/profile')

		} catch (error) {
			res.json({ status: "error", message: error.message });
		}
	}


	static async updateDocuments(req, res){
		try {
			const {uid} = req.params;
			// Procesar los archivos cargados
			const files = req.files;
			if(!req.files) res.status(400).json({ message: 'Error al subir documentos' });

			const user = await UsersService.updateDocuments(uid, files);

			const userLogued = await UsersService.getUserByEmail(req.session.user.email) 
			req.session.user = {

				...req.session.user,
				documents: userLogued.documents,
				isPremium: userLogued.documents.length === 3 ? true : false
			} 


			//res.status(200).json({ status: 'success', message: 'Documentos subidos exitosamente', user });
            res.redirect('/premium')
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error al subir documentos' });
		} 

	}

	static deleteUser = async(req, res)=>{
        try{
            let {uid} = req.params
			let user = await UserModel.findById(uid)
			await cartModel.findByIdAndDelete(user.cart._id)
			
			await UsersService.deleteUser(uid)
           // res.send({result: "success", payload: result})
			res.redirect('/users')
        }catch(error){
            throw new Error(`Error al eliminar el usuario ${error.message}`);
        }
    }


	static async deleteUsers(req, res){
		try {
			// Obtener todos los usuarios
			const allUsers = await UserModel.find();
		
			// Filtrar usuarios inactivos
			const inactiveUsers = allUsers.filter(user => {
			const lastConnection = moment(user.last_connection);
			const cutoffDate = moment().subtract(2, 'days');
			return lastConnection.isBefore(cutoffDate);
			});
		
			// Eliminar usuarios inactivos
			await Promise.all(inactiveUsers.map( async(user) =>{
				await UserModel.findByIdAndDelete(user._id)
				await cartModel.findByIdAndDelete(user.cart._id)
			}));
			

			// Enviar correos a usuarios eliminados
			await Promise.all(inactiveUsers.map(user => {
			const mailOptions = {
				from: `Ecommerce Proyect ${config.adminEmail}`,
				to: user.email,
				subject: 'Cuenta eliminada por inactividad',
				text: 'Tu cuenta ha sido eliminada debido a la inactividad. ¡Vuelve pronto!'
			};
		
			return transporter.sendMail(mailOptions);
			}));
		
			res.redirect("/users")
			//res.status(200).json({ data: inactiveUsers, message: 'Usuarios inactivos eliminados correctamente' });
		} catch (error) {
			console.error('Error al limpiar usuarios inactivos:', error);
			res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

}
import { UsersService } from '../services/users.services.js';
import { UserDto } from '../dao/dto/user.dto.js';

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
		
			res.json({ status: "success", data: user });
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
			
			res.status(200).json({ message: 'Documentos subidos exitosamente', user });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error al subir documentos' });
		} 

}


}
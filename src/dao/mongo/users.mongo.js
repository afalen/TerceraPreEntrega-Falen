import { UserModel } from '../models/user.model.js'
import path from 'path';

export class User{

    static async get() {
        try {
            const user = await UserModel.find();
            return user;
        } catch (error) {
            throw new Error("No se pudieron obtener los Usuarios");
        }
    }

    static async getUser(email){
        try{
            let user = await UserModel.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1, 
				cart: 1, role: 1, last_connection: 1, documents: 1, hasImgProfile: 1, ImgProfile: 1})
			return user
        }catch(error){
            console.error(error)
            return null
        }
    }


	static async getUserById(userId) {
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw new Error("El usuario no existe");
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	static async saveUser(user) {
		try {
			const userCreated = await UserModel.create(user);
			return userCreated;
		} catch (error) {
			throw error;
		}
	}

    static async deleteUser(id){
        try{
            let result = await UserModel.deleteOne({_id: id})
            return result
        }catch(error){
            console.error(error)
            return null
        }
    }


	static async changeRol(userId){
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw new Error("El usuario no existe");
			}
			
			if(user.role == "user"){
				if(user.documents.length === 3){
					user.role = "premium"
				}else{
					throw new Error("No ha terminado de cargar la documentación");
				}
			}else{
				user.role = "user"
			}
			const newUser = await UserModel.updateOne({_id: userId}, user)

			return newUser;

		} catch (error) {
			throw error;
		}
	}

	static async updateDocuments(userId, files){
		try {

			const user = await UserModel.findById(userId)
			if (!user) {
				throw new Error("El usuario no existe");
			}
			//console.log(files)

			// Actualizar el estado del usuario para indicar que ha subido documentos
			user.documents = user.documents.concat(files.map(file => ({
				name: file.originalname,
				reference: path.join('documents', file.filename),
			})));
			
			const newUser = await UserModel.updateOne({_id: userId}, user)
			return newUser;

		} catch (error) {
			throw error;
		}
	}





}


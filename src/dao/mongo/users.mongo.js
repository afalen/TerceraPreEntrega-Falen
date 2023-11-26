import { UserModel } from '../models/user.model.js'

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
            let user = await UserModel.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1, cart: 1, role: 1})
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
			return JSON.parse(JSON.stringify(user));
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

	static async changeRol(userId){
		try {
			const user = await UserModel.findById(userId);
			if (!user) {
				throw new Error("El usuario no existe");
			}
			
			if(user.role == "user"){
				user.role = "premium"
			}else{
				user.role = "user"
			}
			const newUser = await UserModel.updateOne({_id: userId}, user)

			return newUser;

		} catch (error) {
			throw error;
		}


	}

}


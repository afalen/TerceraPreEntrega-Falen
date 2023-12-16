import { usersDao } from '../dao/factory.js';


export class UsersService {
	static async get() {
		return usersDao.get();
	}

	static async getUserByEmail(email){
		return usersDao.getUser(email)
	}

	static async changeRol(id){
		return usersDao.changeRol(id);
	}

	static async updateDocuments(id, files){
		return usersDao.updateDocuments(id, files)
	}
}
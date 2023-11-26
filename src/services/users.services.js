import { usersDao } from '../dao/factory.js';


export class UsersService {
	static async get() {
		return usersDao.get();
	}

	static async changeRol(id){
		return usersDao.changeRol(id);
	}
}
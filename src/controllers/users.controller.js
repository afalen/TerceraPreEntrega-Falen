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

	static async changeRol(req, res){
		try {
			const {uid} = req.params
			const user = await UsersService.changeRol(uid);
		
			res.json({ status: "success", data: user });
		} catch (error) {
			res.json({ status: "error", message: error.message });
		}
	}
}
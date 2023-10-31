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
}
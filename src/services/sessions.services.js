import { usersDao } from '../dao/factory.js'


export class SessionsService{
    static async getUser(email) {
        return usersDao.getUser(email)
    }
}



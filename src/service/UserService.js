import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js"
class UserService {
    constructor(dao) {
        this.dao = dao
    }
    getAllUsers = async () => {
        return this.dao.getUsers()
    }
    getUserById = async (id) => {
        return this.dao.getUserBy(id)
    }
    getUserBy = async (filtro) => {
        return this.dao.getUserBy(filtro)
    }
    createUser = async () => {
        return this.dao.createUser()
    }
    updateUserCart = async (uid, cid) => {
        return this.dao.updateUser(uid, cid)
    }
    deleteUser = async (id) => {
        return this.dao.deleteUser(id)
    }
}

export const userService = new UserService(new UserManager())
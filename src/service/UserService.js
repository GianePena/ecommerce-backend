import { UserManagerMONGO as UserManager } from "../DAO/userManagerMONGO.js"
class UserService {
    constructor(dao) {
        this.dao = dao
    }
    getAllUsers = async () => {
        return this.dao.getUsers()
    }
    getUserById = async (id) => {
        let user = this.dao.getById(id)
        if (!user) {
            console.log(`Usuario con ID ${id} no encontrado`);
            res.status(404).json({ message: "usuario no encontrado" })
        }
        return user
    }
    getUserBy = async (filtro) => {
        return this.dao.getBy(filtro)
    }
    createUser = async () => {
        return this.dao.createUser()
    }
    updateUserCart = async (uid, cid) => {
        return this.dao.updateCart(uid, cid)
    }
    deleteUser = async (id) => {
        return this.dao.delete(id)
    }
}

export const userService = new UserService(new UserManager())
import { userModelo } from "./models/userModelo.js";
import { generaHash } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERRORS } from "../utils/Errors.js"
class UserManagerMONGO {
    async getUsers() {
        return await userModelo.find().lean()
    }
    async getUserById(uid) {
        let user = await userModelo.findById(uid).lean()
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`)
            return CustomError.createError(
                "Error al encontrar usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        return user
    }
    async getBy(filtro = {}) {
        return await userModelo.findOne(filtro)
    }
    async createUser(user) {
        return await userModelo.create(user)
    }
    async updateUserRol(uid, rol) {
        let user = await userModelo.findById(uid)
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`)
            return CustomError.createError(
                "Error al encontrar usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        user.rol = rol
        user.save()
        return user
    }
    async updatePassword(email, password) {
        let user = await userModelo.findOne({ email: email });
        if (!user) {
            logger.warn(`Usuario con email ${email} no encontrado`)
            return CustomError.createError(
                "Error al actualizar la password", `Usuario con email ${email} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        if (user.password === password) {
            return CustomError.createError(
                "Error contraseña ya utilizada ", `Introduzca una nueva contraseña`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
            );
        }
        user.password = generaHash(password);
        await user.save()
        return user
    }
    async delete(uid) {
        const user = await userModelo.findById(uid);
        if (!user) {
            logger.warn(`Usuario con id ${uid} no encontrado`);
            return CustomError.createError(
                "Error al eliminar usuario", `Usuario con id ${uid} no encontrado`, TIPOS_ERRORS.NOT_FOUND
            );
        }
        const result = await userModelo.deleteOne({ _id: uid });
        return { message: `Usuario con id ${uid} eliminado correctamente` };
    }

}

export { UserManagerMONGO }

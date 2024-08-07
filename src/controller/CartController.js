import { cartModelo } from "../DAO/models/cartModelo.js";
import { CartDTO } from "../DTO/CartDTO.js"
import { cartService } from "../service/CartService.js"
import { CustomError } from "../utils/CustomError.js"
import { TIPOS_ERRORS } from "../utils/Errors.js";
import { logger } from "../utils/logger.js";

export class CartController {
    static getCarts = async (req, res, next) => {
        try {
            let carts = await cartService.getCarts()
            //let cartDTO = carts.map(c => new CartDTO(c))
            //res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(carts)
        } catch (error) {
            req.logger.error(`Error fetching all carts: ${error.message}`)
            next(error)
        }
    }
    static getCartById = async (req, res, next) => {
        const { cid } = req.params
        try {
            let cart = await cartService.getCartById(cid)
            req.logger.debug(`id recibido ${cid}`)
            req.logger.info(cart)
            if (!cart) {
                return CustomError.createError("Cart NotFound Error", `Cart con ID ${cid} no encontrado`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(cart);
        } catch (error) {
            req.logger.error(`Error fetching cart by ID `)
            next(error);
        }
    }
    static createCart = async (req, res, next) => {
        const { products } = req.body;
        try {
            if (!products || products.length === 0) {
                throw new Error("Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud");
            }

            for (const product of products) {
                if (!product.product || isNaN(product.quantity)) {
                    throw new Error("El ID del producto es obligatorio y la cantidad de los productos debe ser un número");
                }
            }

            const newCart = await cartService.createCart(products);
            res.status(201).json({ newCart });
        } catch (error) {
            next(error);
        }
    }
    static createCart = async (req, res, next) => {
        const { products, uid } = req.body;
        try {
            if (!products || products.length === 0) {
                req.logger.warn('Datos incompletos necesarios para producto');
                req.logger.debug(`Datos recibidos: ${uid}, ${products}`);
                return next(CustomError.createError("Faltante de datos", "Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS));
            }
            for (const product of products) {
                if (isNaN(product.quantity)) {
                    return next(CustomError.createError(
                        "Datos incorrectos",
                        "La cantidad de los productos debe ser un número",
                        TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS
                    ));
                }
            }
            let newCart;
            if (uid) {
                newCart = await cartService.createCart(uid, products);
            } else {
                newCart = await cartService.createCart(null, products);
            }
            req.logger.info(`Cart creado exitosamente: ${newCart}`);
            res.status(201).json(newCart);
        } catch (error) {
            req.logger.error(`Error en la creacion de un nuevo cart: ${error.message}`);
            next(error);
        }
    }
    static updateQuantity = async (req, res, next) => {
        let { quantity } = req.body
        let { cid, pid } = req.params
        try {
            if (!quantity) {
                return CustomError.createError("Faltante de datos", `Completar la totalidad de los campos`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            if (isNaN(quantity)) return CustomError.createError("Dato incorrecto", "La cantidad de los productos debe ser un número", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            let updateproduct = await cartService.updateQuantity(cid, pid, quantity)
            res.setHeader('Content-Type', 'application/json');
            let cart = await cartModelo.findOne({ _id: cid })
            res.status(200).json(cart)
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static updateQuantity = async (req, res, next) => {
        let { quantity } = req.body
        let { cid, pid } = req.params
        try {
            if (!quantity) {
                return CustomError.createError("Faltante de datos", `Completar la totalidad de los campos`, TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            if (isNaN(quantity)) return CustomError.createError("Dato incorrecto", "La cantidad de los productos debe ser un número", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            let updateproduct = await cartService.updateQuantity(cid, pid, quantity)
            res.setHeader('Content-Type', 'application/json');
            let cart = await cartModelo.findOne({ _id: cid })
            res.status(200).json(cart)
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static updateCart = async (req, res, next) => {
        let { cid } = req.params
        let { products } = req.body
        try {
            if (!products) {
                return CustomError.createError("Faltante de datos", "Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            const updateCart = await cartService.updateCart(cid, products)
            res.setHeader('Content-Type', 'application/json');
            let cart = await cartModelo.findOne({ _id: cid })
            console.log(cart);
            res.status(201).json(updateCart)
        } catch (error) {
            req.logger.error(`Error en la modificacion del cart ID${cid}: ${error.message}`)
            next(error)
        }
    }
    static addProductsToCart = async (req, res, next) => {
        const { cid } = req.params;
        const products = req.body.products
        try {
            if (!products) {
                return CustomError.createError("Faltante de datos", "Debe proporcionar productos (IDs de productos y la cantidad) en el cuerpo de la solicitud", TIPOS_ERRORS.ERROR_TIPOS_DE_DATOS)
            }
            const updatedCart = await cartService.addProductsToCart(cid, products);
            res.status(200).json(updatedCart);
        } catch (error) {
            req.logger.error(`Error en el agregado de productos: ${error.message}`)
            next(error)

        }
    }
    static removeProduct = async (req, res, next) => {
        let { cid, pid } = req.params
        try {
            let removeProduct = await cartService.removeProduct(cid, pid)
            req.logger.info(`Producto id ${pid} eliminado del cart ${cid}`)
            res.setHeader('Content-Type', 'application/json');
            let cart = await cartModelo.findOne({ _id: cid })
            res.status(201).json(cart)
        } catch (error) {
            req.logger.error(`Error en el servido. No se ha podido eliminar ${pid} del cart ${cid}`)
            next(error)
        }
    }
    static removeAllProduct = async (req, res, next) => {
        let { cid } = req.params
        try {
            let removeProducts = await cartService.removeAllProducts(cid)
            req.logger.info(`Productos eliminados del cart ${cid}: Cart vacio`)
            let cart = await cartModelo.findOne({ _id: cid })
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(cart)
        } catch (error) {
            req.logger.error(`Error en el servidor. No se ha podido vaciado del cart ${cid}`)
            next(error)
        }
    }
    static purchase = async (req, res, next) => {
        const { cid } = req.params;
        try {
            const result = await cartService.purchase(cid);
            if (result.error) {
                return CustomError.createError("Error al completar la compra", `NO ES POSIBLE FINLIZAR LA COMPRA`, TIPOS_ERRORS.NOT_FOUND)
            }
            res.status(201).json({ ticket: result.ticket });
        } catch (error) {
            req.logger.error(`Error en finalizalizacion de la compra del cart ${cid}: ${error.message}`)
            next(error)
        }
    }
}

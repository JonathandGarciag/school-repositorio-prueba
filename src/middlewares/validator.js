import  { body, param  } from "express-validator";
import { validarCampos  } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("username", "The username is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").isEmail().withMessage("Ingresa una dirección de correo válida"),
    body("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
    validarCampos
];

export const updateUserRoleValidator = [
    param("id", "Invalid user ID").isMongoId(), 
    body("role", "Role is required").not().isEmpty(), 
    validarCampos 
];


import { Router } from "express";
import { check } from "express-validator";
import { createCategory, getCategory, updateCategory, deleteCategory } from "./category.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { categoryExists } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/tiene-role.js";

const router = Router();
 
router.post(
    '/newCategory', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),  
        check('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),  
        check('name').custom(categoryExists),  
        validarCampos  
    ], 
    createCategory  
);

router.get(
    '/viewCategory', 
    getCategory  
);

router.put(
    '/updateCategory/:id', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),
    ],
    updateCategory
);

router.delete(
    '/deleteCategory/:id', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),
        check("id", "Este id no es valido").isMongoId(),
        check("id").custom(categoryExists)
    ],
    deleteCategory
);



export default router;
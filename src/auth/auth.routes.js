import { Router } from "express";
import { register, login, updateUserRole } from "../auth/auth.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { registerValidator, loginValidator, updateUserRoleValidator  } from "../middlewares/validator.js";
import { tieneRole } from "../middlewares/tiene-role.js";

const router = Router();

router.post(
    '/register',
    registerValidator,
    register
)

router.post(
    '/login',
    loginValidator,
    login
)

router.put(
    '/updateRole/:id', 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE")
    ],
    updateUserRoleValidator, 
    updateUserRole 
);

export default router;

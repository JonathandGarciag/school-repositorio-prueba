import { hash, verify } from "argon2";
import Usuario from '../user/user.model.js'
import { generarJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
    try {

        const { name, username, email, password } = req.body; 

        const encryptedPassword = await hash(password); 

        const user = await Usuario.create({
            name,
            username,
            email,
            password: encryptedPassword,
            role: "CUSTOMER_ROLE",  
        });

        return res.status(200).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email,
                role: user.role, 
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User registration failed",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;

        const user = await Usuario.findOne({ email: lowerEmail });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: 'El usuario está deshabilitado'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            });
        }

        const token = await generarJWT(user.id);
 
        return res.status(200).json({
            msg: "Inicio de sesión exitoso!!",
            userDetails: {
                username: user.username,
                email: user.email, 
                role: user.role,
                token: token,
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Server error',
            error: e.message
        });
    }
}

export const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        const adminUser = req.user;

        if (adminUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "No tienes permisos para cambiar roles"
            });
        }

        const validRoles = ["ADMIN_ROLE", "CUSTOMER_ROLE"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                msg: "El rol ingresado no es válido"
            });
        }

        const user = await Usuario.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).json({
                msg: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Rol actualizado correctamente",
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al actualizar rol",
            error: error.message,
        });
    }
};

import { hash, verify } from "argon2";
import User from '../user/user.model.js'
import { generarJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
    try {

        const { name, username, email, password } = req.body; 

        const encryptedPassword = await hash(password); 

        const user = await User.create({
            name,
            username,
            email,
            password: encryptedPassword,
        });

        return res.status(200).json({
            message: "Usuario registrado exitosamente",
            userDetails: {
                user: user.email
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error en el registro de usuario",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;

        const user = await User.findOne({ email: lowerEmail });

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
            msg: 'Error al logiarse',
            error: e.message
        });
    }
}

export const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(id, { role: role }, { new: true });

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

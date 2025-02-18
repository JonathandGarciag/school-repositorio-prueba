import { response, request } from "express";
import { hash, verify  } from "argon2";
import User from '../user/user.model.js';
import jwt from "jsonwebtoken"

export const getUser = async (req, res) => {
    try {
        const token = req.header('x-token');
        
        if (!token) {
            return res.status(401).json({
                msg: 'No hay token en la petición',
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const authenticatedUser = await User.findById(uid);

        if (authenticatedUser.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                msg: 'No tiene permisos para realizar esta acción',
            });
        }

        const { limit = 10, desde = 0 } = req.query;
        const query = { status: true };

        // Incluir 'password' en la selección explícitamente
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limit))
                .select('name username email role status createdAt updatedAt password') // Aquí incluimos 'password'
        ]);

        res.status(200).json({
            success: true,
            total,
            users,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            e
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, password, oldPassword, ...data } = req.body;

        // Obtener el token de la cabecera
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No hay token en la petición",
            });
        }

        // Verificar el token y obtener el UID del usuario
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Verificar si el usuario que quiere actualizar su información es el mismo que está en el token
        if (id !== uid) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para modificar este usuario",
            });
        }

        // Buscar al usuario en la base de datos
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        // Verificar si se quiere cambiar la contraseña y validar la contraseña actual
        if (password) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    msg: "Se requiere la contraseña anterior para cambiar la nueva",
                });
            }

            // Verificar si la contraseña anterior es correcta
            const validOldPassword = await verify(user.password, oldPassword);
            if (!validOldPassword) {
                return res.status(401).json({
                    success: false,
                    msg: "La contraseña anterior no es correcta",
                });
            }

            // Si la contraseña es válida, actualizar la nueva contraseña
            data.password = await hash(password);
        }

        // El rol no debe ser actualizado, asegurémonos de que no se modifique
        delete data.role;

        // Actualizar el usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: error.message,
        });
    }
};

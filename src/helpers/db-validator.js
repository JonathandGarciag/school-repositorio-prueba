import User from '../user/user.model.js';
import Role from '../role/role.model.js'; 
import Category from '../category/category.model.js'

export const esRoleValido = async (role = '') => {
    try {
        const roleExist = await Role.findOne({ role: role });

        if (!roleExist) {

            throw new Error(`El rol ${role} no existe en la base de datos.`);
        }
    } catch (err) {
        throw new Error(`Error al verificar el rol ${role}: ${err.message}`);
    }
};


export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};

export const categoryExists = async (name = '') => {
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        throw new Error(`La categoría "${name}" ya existe`);
    }
};

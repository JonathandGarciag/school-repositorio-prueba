import User from '../user/user.model.js';

export const esRoleValido = async (role = '') => {

    const rolesValidos = ["ADMIN_ROLE", "CUSTOMER_ROLE"];

    if (!rolesValidos.includes(role)) {
        
        throw new Error(`El rol ${role} no es válido`);
    }
};

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
};




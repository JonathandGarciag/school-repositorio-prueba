"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import argon2 from "argon2";
import { dbConnection } from './mongo.js';
import { esRoleValido } from '../src/helpers/db-validator.js'; 
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import User from '../src/user/user.model.js';
import Category from '../src/category/category.model.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import productRoutes from '../src/product/product.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import invoiceRoutes from '../src/acquisition/invoice/invoice.routes.js';
import historyRoutes from '../src/acquisition/history/history.routes.js';
import cartRoutes from '../src/acquisition/cart/cart.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
} 

const routes = (app) => {
    app.use("/proyect-store/vfinal/user", userRoutes)
    app.use("/proyect-store/vfinal/auth", authRoutes)
    app.use("/proyect-store/vfinal/product", productRoutes)
    app.use("/proyect-store/vfinal/category", categoryRoutes)
    app.use("/proyect-store/vfinal/invoice", invoiceRoutes)
    app.use("/proyect-store/vfinal/history", historyRoutes)
    app.use("/proyect-store/vfinal/cart", cartRoutes)
}

const conectarDB = async () =>{
    try {
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectado ala base de datos', error);
        process.exit(1);
    }
}

const createDefaultCategory = async () => {
    try {
        const existingCategory = await Category.findOne({ name: "General" });

        if (!existingCategory) {
            const defaultCategory = new Category({
                name: "General",
                description: "Categoría predeterminada",
                isDefault: true
            });

            await defaultCategory.save();
            console.log(" -> Categoría por defecto creada correctamente.");
        } else {
            console.log(" -> La categoría por defecto ya existe.");
        }
    } catch (error) {
        console.error(" -> Error al crear la categoría por defecto:", error);
    }
};

const createAdmin = async () => {
    try {
        const aEmail = "jgarciadmin@gmail.com";
        const aPassword = "12345678";
        const aRole = "ADMIN_ROLE"; 

        await esRoleValido(aRole);

        const existingAdmin = await User.findOne({ email: aEmail });

        if (!existingAdmin) {
            const encryptedPassword = await argon2.hash(aPassword); 
            const aUser = new User({
                name: "Jonathan Gutierrez",
                username: "AdminJhonny",
                email: aEmail,
                password: encryptedPassword,
                role: aRole,
            });

            await aUser.save();
            console.log(" -> Usuario ADMIN creado correctamente.");
        } else {
            console.log(" -> Ya existe un usuario ADMIN.");
        }
    } catch (err) {
        console.error(" -> Error al crear el ADMIN por defecto:", err);
    }
};



export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        await createDefaultCategory();  
        await createAdmin();  
        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (err) {
        console.log(`Server init failed ${err}`);
    }
}


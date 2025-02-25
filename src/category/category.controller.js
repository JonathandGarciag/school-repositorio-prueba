import { response } from "express";
import Category from "./category.model.js";
import { categoryExists } from '../helpers/db-validator.js';
import Product from "../product/product.model.js"; 
import jwt from "jsonwebtoken";

export const createCategory = async (req, res = response) => {
    try {
        const { name, description } = req.body;

        const category = new Category({ name: name, description: description });
        await category.save();

        res.status(201).json({
            success: true,
            msg: "Categoría creada correctamente",
            category,
        });
    } catch (error) {
        console.error("Error en createCategory:", error);
        res.status(500).json({
            success: false,
            msg: "Error al crear categoría",
        });
    }
};
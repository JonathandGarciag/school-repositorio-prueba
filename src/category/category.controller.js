import { response } from "express";
import Category from "./category.model.js";
import Product from "../product/product.model.js";
import { categoryExists } from '../helpers/db-validator.js';

export const createCategory = async (req, res = response) => {
    try {
        const { name, description } = req.body;

        const category = new Category({ name: name, description: description });
        await category.save();

        return res.status(201).json({
            success: true,
            msg: "Categoría creada correctamente",
            category,
        });
    } catch (error) {
        console.error("Error en createCategory:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear categoría",
        });
    }
};

export const getCategory = async (req, res = response) => {
    try {
        const categories = await Category.find({ status: true });

        return res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Error en getCategories:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al obtener categorías" 
        });
    }
};

export const updateCategory = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { name, description } = req.body;

        await categoryExists(name); 

        const category = await Category.findByIdAndUpdate(id, { name: name, description: description }, { new: true });

        await Product.updateMany(
            { category: id },
            { categoryName: name, categoryDescription: description }
        );

        res.status(200).json({
            success: true,
            
            msg: "Categoría actualizada correctamente en toda la base de datos",
            category,
        });

    } catch (error) {
        console.error("Error en updateCategory:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error al actualizar categoría",
            error: error.message 
        });
    }
};

export const deleteCategory = async (req, res = response) => {
    try {

        const { id } = req.params;

        const category = await Category.findById(id);

        if (category.isDefault) {
            return res.status(400).json({
                success: false,
                msg: "No puedes deshabilitar la categoría por defecto",
            });
        }

        const defaultCategory = await Category.findOne({ isDefault: true });
        if (!defaultCategory) {
            return res.status(500).json({ msg: "No se encontró la categoría por defecto" });
        }

        await Product.updateMany(
            { category: id },
            { category: defaultCategory._id, categoryName: defaultCategory.name }
        );

        await Category.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            msg: "Categoría deshabilitada correctamente y los productos reasignadas a la categoría 'General'.",
        });

    } catch (error) {
        console.error("Error en deleteCategory:", error);
        res.status(500).json({ success: false, msg: "Error al deshabilitar categoría" });
    }
};
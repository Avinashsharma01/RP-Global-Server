"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const getProducts = async (req, res) => {
    try {
        const { category, includeDrafts } = req.query;
        const filter = {};
        if (includeDrafts !== "true") {
            filter.isPublished = true;
        }
        if (category) {
            filter.category = category;
        }
        const products = await Product_1.Product.find(filter).sort({ order: 1, createdAt: 1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products.",
            error: error.message,
        });
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res) => {
    try {
        const slug = String(req.params.slug);
        const product = await Product_1.Product.findOne({ slug: slug.toLowerCase() });
        if (!product) {
            res.status(404).json({
                success: false,
                message: `Industrial plant solution with slug '${slug}' not found.`,
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product details.",
            error: error.message,
        });
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    try {
        const product = new Product_1.Product(req.body);
        await product.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create product.",
            error: error.message,
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update product.",
            error: error.message,
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.Product.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product.",
            error: error.message,
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map
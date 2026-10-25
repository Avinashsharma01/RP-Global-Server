import { Request, Response } from "express";
import { Product } from "../models/Product";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, includeDrafts } = req.query;

    const filter: any = {};
    if (includeDrafts !== "true") {
      filter.isPublished = true;
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    const product = await Product.findOne({ slug: slug.toLowerCase() });

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details.",
      error: error.message,
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create product.",
      error: error.message,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
      error: error.message,
    });
  }
};

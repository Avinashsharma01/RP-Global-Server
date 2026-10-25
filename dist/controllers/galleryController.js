"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectImage = exports.uploadProjectImages = exports.deleteGalleryItem = exports.updateGalleryItem = exports.createGalleryItem = exports.getGallery = void 0;
const ProjectGallery_1 = require("../models/ProjectGallery");
const getGallery = async (req, res) => {
    try {
        const { category, featured, status } = req.query;
        const filter = {};
        if (category && category !== "ALL") {
            filter.category = category;
        }
        if (featured === "true") {
            filter.isFeatured = true;
        }
        if (status && status !== "ALL") {
            filter.status = status;
        }
        const items = await ProjectGallery_1.ProjectGallery.find(filter).sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch gallery items.",
            error: error.message,
        });
    }
};
exports.getGallery = getGallery;
const createGalleryItem = async (req, res) => {
    try {
        const { title, category, capacityKLD, location, clientSector, status = "COMPLETED", progressPercentage = 100, currentStage = "Commissioned & Handed Over", expectedCompletion = "", keyHighlights, isFeatured, completionYear, } = req.body;
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        if (!title || !category || !capacityKLD || !location || !clientSector || !imageUrl) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: title, category, capacityKLD, location, clientSector, and imageUrl/file.",
            });
            return;
        }
        let parsedHighlights = [];
        if (Array.isArray(keyHighlights)) {
            parsedHighlights = keyHighlights;
        }
        else if (typeof keyHighlights === "string") {
            try {
                parsedHighlights = JSON.parse(keyHighlights);
            }
            catch {
                parsedHighlights = keyHighlights.split(",").map((s) => s.trim()).filter(Boolean);
            }
        }
        let parsedImages = [];
        if (Array.isArray(req.body.images)) {
            parsedImages = req.body.images;
        }
        else if (typeof req.body.images === "string") {
            try {
                parsedImages = JSON.parse(req.body.images);
            }
            catch {
                parsedImages = req.body.images.split(",").map((s) => s.trim()).filter(Boolean);
            }
        }
        // Default gallery images to include primary image if empty
        if (parsedImages.length === 0 && imageUrl) {
            parsedImages = [imageUrl];
        }
        const parsedProgress = parseInt(progressPercentage, 10);
        const item = new ProjectGallery_1.ProjectGallery({
            title,
            category,
            capacityKLD,
            location,
            clientSector,
            imageUrl,
            images: parsedImages,
            status: status === "RUNNING" ? "RUNNING" : "COMPLETED",
            progressPercentage: isNaN(parsedProgress) ? (status === "RUNNING" ? 65 : 100) : parsedProgress,
            currentStage: currentStage || (status === "RUNNING" ? "Erection & Skid Assembly" : "Commissioned & Handed Over"),
            expectedCompletion: expectedCompletion || "",
            keyHighlights: parsedHighlights,
            completionYear: completionYear ? parseInt(completionYear, 10) : new Date().getFullYear(),
            isFeatured: isFeatured === "true" || isFeatured === true,
        });
        await item.save();
        res.status(201).json({
            success: true,
            message: "Gallery item added successfully.",
            data: item,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create gallery item.",
            error: error.message,
        });
    }
};
exports.createGalleryItem = createGalleryItem;
const updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ProjectGallery_1.ProjectGallery.findById(id);
        if (!item) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }
        const { title, category, capacityKLD, location, clientSector, status, progressPercentage, currentStage, expectedCompletion, keyHighlights, completionYear, isFeatured, order, } = req.body;
        if (title !== undefined)
            item.title = title;
        if (category !== undefined)
            item.category = category;
        if (capacityKLD !== undefined)
            item.capacityKLD = capacityKLD;
        if (location !== undefined)
            item.location = location;
        if (clientSector !== undefined)
            item.clientSector = clientSector;
        if (status !== undefined) {
            item.status = status === "RUNNING" ? "RUNNING" : "COMPLETED";
            if (item.status === "COMPLETED" && progressPercentage === undefined) {
                item.progressPercentage = 100;
                item.currentStage = "Commissioned & Handed Over";
            }
        }
        if (progressPercentage !== undefined) {
            const p = parseInt(progressPercentage, 10);
            if (!isNaN(p))
                item.progressPercentage = p;
        }
        if (currentStage !== undefined)
            item.currentStage = currentStage;
        if (expectedCompletion !== undefined)
            item.expectedCompletion = expectedCompletion;
        if (completionYear !== undefined)
            item.completionYear = parseInt(completionYear, 10);
        if (isFeatured !== undefined)
            item.isFeatured = isFeatured === "true" || isFeatured === true;
        if (order !== undefined)
            item.order = parseInt(order, 10);
        if (keyHighlights !== undefined) {
            if (Array.isArray(keyHighlights)) {
                item.keyHighlights = keyHighlights;
            }
            else if (typeof keyHighlights === "string") {
                try {
                    item.keyHighlights = JSON.parse(keyHighlights);
                }
                catch {
                    item.keyHighlights = keyHighlights.split(",").map((s) => s.trim()).filter(Boolean);
                }
            }
        }
        if (req.body.images !== undefined) {
            if (Array.isArray(req.body.images)) {
                item.images = req.body.images;
            }
            else if (typeof req.body.images === "string") {
                try {
                    item.images = JSON.parse(req.body.images);
                }
                catch {
                    item.images = req.body.images.split(",").map((s) => s.trim()).filter(Boolean);
                }
            }
        }
        if (req.file) {
            item.imageUrl = `/uploads/${req.file.filename}`;
            // Add to images list if not present
            if (!item.images)
                item.images = [];
            if (!item.images.includes(item.imageUrl)) {
                item.images.unshift(item.imageUrl);
            }
        }
        else if (req.body.imageUrl) {
            item.imageUrl = req.body.imageUrl;
        }
        await item.save();
        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: item,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update project.",
            error: error.message,
        });
    }
};
exports.updateGalleryItem = updateGalleryItem;
const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ProjectGallery_1.ProjectGallery.findByIdAndDelete(id);
        if (!item) {
            res.status(404).json({ success: false, message: "Gallery item not found." });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Gallery item deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete gallery item.",
            error: error.message,
        });
    }
};
exports.deleteGalleryItem = deleteGalleryItem;
// Upload multiple images to a specific project
const uploadProjectImages = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ProjectGallery_1.ProjectGallery.findById(id);
        if (!item) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }
        const newImageUrls = [];
        // Files uploaded via multipart
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach((file) => {
                newImageUrls.push(`/uploads/${file.filename}`);
            });
        }
        // Direct image URL or URLs sent in body
        if (req.body.imageUrl && typeof req.body.imageUrl === "string") {
            newImageUrls.push(req.body.imageUrl);
        }
        if (req.body.images) {
            if (Array.isArray(req.body.images)) {
                newImageUrls.push(...req.body.images);
            }
            else if (typeof req.body.images === "string") {
                try {
                    const parsed = JSON.parse(req.body.images);
                    if (Array.isArray(parsed))
                        newImageUrls.push(...parsed);
                    else
                        newImageUrls.push(req.body.images);
                }
                catch {
                    newImageUrls.push(req.body.images);
                }
            }
        }
        if (newImageUrls.length === 0) {
            res.status(400).json({ success: false, message: "No images provided to upload." });
            return;
        }
        const currentImages = item.images || [];
        if (item.imageUrl && !currentImages.includes(item.imageUrl)) {
            currentImages.unshift(item.imageUrl);
        }
        const combined = Array.from(new Set([...currentImages, ...newImageUrls]));
        item.images = combined;
        await item.save();
        res.status(200).json({
            success: true,
            message: `${newImageUrls.length} image(s) added to project gallery.`,
            data: item,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload project images.",
            error: error.message,
        });
    }
};
exports.uploadProjectImages = uploadProjectImages;
// Delete a specific image from a project's gallery
const deleteProjectImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;
        if (!imageUrl) {
            res.status(400).json({ success: false, message: "imageUrl is required in request body." });
            return;
        }
        const item = await ProjectGallery_1.ProjectGallery.findById(id);
        if (!item) {
            res.status(404).json({ success: false, message: "Project not found." });
            return;
        }
        item.images = (item.images || []).filter((img) => img !== imageUrl);
        // If removed image was the primary imageUrl, set to next available image
        if (item.imageUrl === imageUrl && item.images.length > 0) {
            item.imageUrl = item.images[0];
        }
        await item.save();
        res.status(200).json({
            success: true,
            message: "Image removed from project gallery.",
            data: item,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete project image.",
            error: error.message,
        });
    }
};
exports.deleteProjectImage = deleteProjectImage;
//# sourceMappingURL=galleryController.js.map
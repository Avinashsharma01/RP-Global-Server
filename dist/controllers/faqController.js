"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderFAQs = exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.getFAQById = exports.getAdminFAQs = exports.getFAQs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const FAQ_1 = require("../models/FAQ");
const db_1 = require("../config/db");
const initialFaqs_1 = require("../data/initialFaqs");
// File storage path for offline / disconnected DB persistence
const DATA_DIR = path_1.default.resolve(process.cwd(), "data");
const FAQS_FILE = path_1.default.join(DATA_DIR, "faqs.json");
// Helper to ensure data directory and file exist
function getFileStore() {
    try {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs_1.default.existsSync(FAQS_FILE)) {
            fs_1.default.writeFileSync(FAQS_FILE, JSON.stringify(initialFaqs_1.INITIAL_FAQS, null, 2), "utf-8");
            return initialFaqs_1.INITIAL_FAQS;
        }
        const data = fs_1.default.readFileSync(FAQS_FILE, "utf-8");
        return JSON.parse(data);
    }
    catch (err) {
        console.error("[FAQ FileStore] Error reading file store:", err);
        return initialFaqs_1.INITIAL_FAQS;
    }
}
function saveFileStore(items) {
    try {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs_1.default.writeFileSync(FAQS_FILE, JSON.stringify(items, null, 2), "utf-8");
    }
    catch (err) {
        console.error("[FAQ FileStore] Error saving file store:", err);
    }
}
/**
 * Public: GET /api/v1/faqs
 * Returns active FAQs sorted by order and creation date
 */
const getFAQs = async (req, res) => {
    try {
        const { category, search } = req.query;
        if ((0, db_1.isDBConnected)()) {
            const filter = { isActive: true };
            if (category && category !== "All") {
                filter.category = category;
            }
            if (search) {
                const regex = new RegExp(String(search), "i");
                filter.$or = [{ question: regex }, { answer: regex }, { tags: regex }];
            }
            const faqs = await FAQ_1.FAQ.find(filter).sort({ order: 1, createdAt: 1 });
            // If DB has 0 items, seed the default ones into DB
            if (faqs.length === 0 && !search && !category) {
                const seeded = await FAQ_1.FAQ.insertMany(initialFaqs_1.INITIAL_FAQS.map(({ _id, ...rest }) => rest));
                res.status(200).json({
                    success: true,
                    count: seeded.length,
                    data: seeded,
                });
                return;
            }
            res.status(200).json({
                success: true,
                count: faqs.length,
                data: faqs,
            });
            return;
        }
        // Fallback file/memory store when MongoDB is not connected
        let items = getFileStore().filter((item) => item.isActive);
        if (category && category !== "All") {
            items = items.filter((item) => item.category === category);
        }
        if (search) {
            const q = String(search).toLowerCase();
            items = items.filter((item) => item.question.toLowerCase().includes(q) ||
                item.answer.toLowerCase().includes(q) ||
                item.tags?.some((t) => t.toLowerCase().includes(q)));
        }
        items.sort((a, b) => a.order - b.order);
        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
            source: "file_store",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FAQs.",
            error: error.message,
        });
    }
};
exports.getFAQs = getFAQs;
/**
 * Admin: GET /api/v1/faqs/admin
 * Returns all FAQs (including drafts/inactive) with metadata
 */
const getAdminFAQs = async (_req, res) => {
    try {
        if ((0, db_1.isDBConnected)()) {
            let faqs = await FAQ_1.FAQ.find().sort({ order: 1, createdAt: 1 });
            if (faqs.length === 0) {
                const seeded = await FAQ_1.FAQ.insertMany(initialFaqs_1.INITIAL_FAQS.map(({ _id, ...rest }) => rest));
                faqs = seeded;
            }
            const activeCount = faqs.filter((f) => f.isActive).length;
            const categories = Array.from(new Set(faqs.map((f) => f.category)));
            res.status(200).json({
                success: true,
                count: faqs.length,
                metrics: {
                    total: faqs.length,
                    active: activeCount,
                    inactive: faqs.length - activeCount,
                    categories: categories.length,
                },
                categories,
                data: faqs,
            });
            return;
        }
        // File store fallback
        const items = getFileStore();
        items.sort((a, b) => a.order - b.order);
        const activeCount = items.filter((f) => f.isActive).length;
        const categories = Array.from(new Set(items.map((f) => f.category)));
        res.status(200).json({
            success: true,
            count: items.length,
            metrics: {
                total: items.length,
                active: activeCount,
                inactive: items.length - activeCount,
                categories: categories.length,
            },
            categories,
            data: items,
            source: "file_store",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin FAQs.",
            error: error.message,
        });
    }
};
exports.getAdminFAQs = getAdminFAQs;
/**
 * Public/Admin: GET /api/v1/faqs/:id
 */
const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, db_1.isDBConnected)()) {
            const faq = await FAQ_1.FAQ.findById(id);
            if (!faq) {
                res.status(404).json({ success: false, message: "FAQ item not found." });
                return;
            }
            res.status(200).json({ success: true, data: faq });
            return;
        }
        const items = getFileStore();
        const faq = items.find((f) => f._id === id);
        if (!faq) {
            res.status(404).json({ success: false, message: "FAQ item not found." });
            return;
        }
        res.status(200).json({ success: true, data: faq });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FAQ item.",
            error: error.message,
        });
    }
};
exports.getFAQById = getFAQById;
/**
 * Admin: POST /api/v1/faqs
 * Create a new FAQ item
 */
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category, order, isActive, tags } = req.body;
        if (!question || !answer) {
            res.status(400).json({
                success: false,
                message: "Question and answer are both required.",
            });
            return;
        }
        const newCategory = category && category.trim() ? category.trim() : "General";
        const newOrder = typeof order === "number" ? order : 0;
        const active = isActive !== undefined ? Boolean(isActive) : true;
        const parsedTags = Array.isArray(tags) ? tags : [];
        if ((0, db_1.isDBConnected)()) {
            const faq = new FAQ_1.FAQ({
                question: question.trim(),
                answer: answer.trim(),
                category: newCategory,
                order: newOrder,
                isActive: active,
                tags: parsedTags,
            });
            await faq.save();
            // Also sync to file store for resilience
            const items = getFileStore();
            items.push({
                _id: String(faq._id),
                question: faq.question,
                answer: faq.answer,
                category: faq.category,
                order: faq.order,
                isActive: faq.isActive,
                tags: faq.tags,
                createdAt: faq.createdAt.toISOString(),
                updatedAt: faq.updatedAt.toISOString(),
            });
            saveFileStore(items);
            res.status(201).json({
                success: true,
                message: "FAQ created successfully.",
                data: faq,
            });
            return;
        }
        // File store mode
        const items = getFileStore();
        const newId = `faq-${Date.now()}`;
        const newFaq = {
            _id: newId,
            question: question.trim(),
            answer: answer.trim(),
            category: newCategory,
            order: newOrder || items.length + 1,
            isActive: active,
            tags: parsedTags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        items.push(newFaq);
        saveFileStore(items);
        res.status(201).json({
            success: true,
            message: "FAQ created successfully.",
            data: newFaq,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create FAQ.",
            error: error.message,
        });
    }
};
exports.createFAQ = createFAQ;
/**
 * Admin: PUT /api/v1/faqs/:id
 * Update an existing FAQ item
 */
const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, category, order, isActive, tags } = req.body;
        if ((0, db_1.isDBConnected)()) {
            const updateData = {};
            if (question !== undefined)
                updateData.question = question.trim();
            if (answer !== undefined)
                updateData.answer = answer.trim();
            if (category !== undefined)
                updateData.category = category.trim();
            if (order !== undefined)
                updateData.order = Number(order);
            if (isActive !== undefined)
                updateData.isActive = Boolean(isActive);
            if (tags !== undefined)
                updateData.tags = Array.isArray(tags) ? tags : [];
            const faq = await FAQ_1.FAQ.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!faq) {
                res.status(404).json({ success: false, message: "FAQ item not found." });
                return;
            }
            // Sync file store
            const items = getFileStore();
            const idx = items.findIndex((f) => f._id === id);
            if (idx !== -1) {
                items[idx] = {
                    ...items[idx],
                    ...updateData,
                    updatedAt: new Date().toISOString(),
                };
                saveFileStore(items);
            }
            res.status(200).json({
                success: true,
                message: "FAQ updated successfully.",
                data: faq,
            });
            return;
        }
        // File store update
        const items = getFileStore();
        const idx = items.findIndex((f) => f._id === id);
        if (idx === -1) {
            res.status(404).json({ success: false, message: "FAQ item not found." });
            return;
        }
        const current = items[idx];
        const updated = {
            ...current,
            question: question !== undefined ? question.trim() : current.question,
            answer: answer !== undefined ? answer.trim() : current.answer,
            category: category !== undefined ? category.trim() : current.category,
            order: order !== undefined ? Number(order) : current.order,
            isActive: isActive !== undefined ? Boolean(isActive) : current.isActive,
            tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : current.tags,
            updatedAt: new Date().toISOString(),
        };
        items[idx] = updated;
        saveFileStore(items);
        res.status(200).json({
            success: true,
            message: "FAQ updated successfully.",
            data: updated,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update FAQ.",
            error: error.message,
        });
    }
};
exports.updateFAQ = updateFAQ;
/**
 * Admin: DELETE /api/v1/faqs/:id
 * Delete an FAQ item
 */
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, db_1.isDBConnected)()) {
            const faq = await FAQ_1.FAQ.findByIdAndDelete(id);
            if (!faq) {
                res.status(404).json({ success: false, message: "FAQ item not found." });
                return;
            }
            const items = getFileStore();
            saveFileStore(items.filter((f) => f._id !== id));
            res.status(200).json({
                success: true,
                message: "FAQ deleted successfully.",
            });
            return;
        }
        // File store delete
        const items = getFileStore();
        const exists = items.some((f) => f._id === id);
        if (!exists) {
            res.status(404).json({ success: false, message: "FAQ item not found." });
            return;
        }
        const filtered = items.filter((f) => f._id !== id);
        saveFileStore(filtered);
        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete FAQ.",
            error: error.message,
        });
    }
};
exports.deleteFAQ = deleteFAQ;
/**
 * Admin: POST /api/v1/faqs/reorder
 * Batch update orders of FAQs
 */
const reorderFAQs = async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id: string, order: number }
        if (!Array.isArray(orders)) {
            res.status(400).json({
                success: false,
                message: "Orders array is required ({ id: string, order: number }[]).",
            });
            return;
        }
        if ((0, db_1.isDBConnected)()) {
            const updatePromises = orders.map(({ id, order }) => FAQ_1.FAQ.findByIdAndUpdate(id, { order }));
            await Promise.all(updatePromises);
        }
        const items = getFileStore();
        const orderMap = new Map(orders.map((o) => [o.id, o.order]));
        const updated = items.map((item) => {
            if (orderMap.has(item._id)) {
                return { ...item, order: orderMap.get(item._id) };
            }
            return item;
        });
        saveFileStore(updated);
        res.status(200).json({
            success: true,
            message: "FAQs reordered successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reorder FAQs.",
            error: error.message,
        });
    }
};
exports.reorderFAQs = reorderFAQs;
//# sourceMappingURL=faqController.js.map
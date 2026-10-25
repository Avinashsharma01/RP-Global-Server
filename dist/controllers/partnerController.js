"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePartnerStatus = exports.deletePartner = exports.updatePartner = exports.createPartner = exports.getPartnerById = exports.getAllPartners = exports.getPartners = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Partner_1 = require("../models/Partner");
const db_1 = require("../config/db");
const uploadDir = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
const jsonStorePath = path_1.default.join(uploadDir, "partners_data.json");
// Ensure upload directory exists
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Default initial high-profile industrial partners
const DEFAULT_PARTNERS = [
    {
        _id: "partner-1",
        name: "Tata Chemicals Ltd",
        category: "Industrial Enterprise",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
        website: "https://www.tatachemicals.com",
        description: "1,200 KLD ZLD Effluent Recovery & Desalination Infrastructure",
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-2",
        name: "Cipla Pharmaceuticals",
        category: "Pharma & Biotech",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Cipla_logo.svg",
        website: "https://www.cipla.com",
        description: "Ultra-pure Demineralized Water (DM) & Sanitary RO Skids",
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-3",
        name: "Reliance Industries Limited",
        category: "Industrial Enterprise",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Reliance_Industries_Logo.svg/1200px-Reliance_Industries_Logo.svg.png",
        website: "https://www.ril.com",
        description: "Heavy Hydrocarbon & Petrochemical ETP Clarification Systems",
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-4",
        name: "Grundfos Water Technology",
        category: "OEM Equipment Partner",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Grundfos_logo.svg/1280px-Grundfos_logo.svg.png",
        website: "https://www.grundfos.com",
        description: "High-Efficiency Submersible & Multistage Booster Pump Skids",
        order: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-5",
        name: "Larsen & Toubro (L&T)",
        category: "EPC & Infrastructure",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/L%26T.png/640px-L%26T.png",
        website: "https://www.larsentoubro.com",
        description: "Turnkey Municipal & Mega Industrial Effluent Treatment EPC",
        order: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-6",
        name: "Dow Water & Process Solutions",
        category: "Technology Licensor",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Dow_Chemical_Company_logo.svg/1280px-Dow_Chemical_Company_logo.svg.png",
        website: "https://www.dow.com",
        description: "FilmTec™ Reverse Osmosis & Ion Exchange Resin Media",
        order: 6,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-7",
        name: "Thermax Global",
        category: "Technology Licensor",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Thermax_Logo.svg",
        website: "https://www.thermaxglobal.com",
        description: "Condensate Polishing Units & Boiler Feed Demineralizers",
        order: 7,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: "partner-8",
        name: "Sun Pharma Laboratories",
        category: "Pharma & Biotech",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sun_Pharma_logo.svg/1280px-Sun_Pharma_logo.svg.png",
        website: "https://sunpharma.com",
        description: "Zero Discharge Sterile API Wastewater Treatment Systems",
        order: 8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
// Read from JSON file store
function readLocalStore() {
    try {
        if (!fs_1.default.existsSync(jsonStorePath)) {
            fs_1.default.writeFileSync(jsonStorePath, JSON.stringify(DEFAULT_PARTNERS, null, 2), "utf-8");
            return DEFAULT_PARTNERS;
        }
        const raw = fs_1.default.readFileSync(jsonStorePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
        fs_1.default.writeFileSync(jsonStorePath, JSON.stringify(DEFAULT_PARTNERS, null, 2), "utf-8");
        return DEFAULT_PARTNERS;
    }
    catch (err) {
        console.error("[Partners Store] Error reading local JSON:", err);
        return DEFAULT_PARTNERS;
    }
}
// Write to JSON file store
function writeLocalStore(data) {
    try {
        fs_1.default.writeFileSync(jsonStorePath, JSON.stringify(data, null, 2), "utf-8");
    }
    catch (err) {
        console.error("[Partners Store] Error writing local JSON:", err);
    }
}
/**
 * Public: Get active partners for landing page
 */
const getPartners = async (req, res) => {
    try {
        const { category } = req.query;
        if ((0, db_1.isDBConnected)()) {
            const filter = { isActive: true };
            if (category && category !== "ALL") {
                filter.category = category;
            }
            const dbPartners = await Partner_1.Partner.find(filter).sort({ order: 1, createdAt: -1 });
            if (dbPartners && dbPartners.length > 0) {
                res.status(200).json({
                    success: true,
                    count: dbPartners.length,
                    data: dbPartners,
                });
                return;
            }
        }
        // Fallback to local persistent store
        let partners = readLocalStore().filter((p) => p.isActive !== false);
        if (category && category !== "ALL") {
            partners = partners.filter((p) => p.category === category);
        }
        partners.sort((a, b) => (a.order || 0) - (b.order || 0));
        res.status(200).json({
            success: true,
            count: partners.length,
            data: partners,
        });
    }
    catch (error) {
        console.error("Failed to get partners:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch partners.",
            error: error.message,
        });
    }
};
exports.getPartners = getPartners;
/**
 * Admin: Get all partners (including inactive)
 */
const getAllPartners = async (_req, res) => {
    try {
        if ((0, db_1.isDBConnected)()) {
            const dbPartners = await Partner_1.Partner.find({}).sort({ order: 1, createdAt: -1 });
            if (dbPartners && dbPartners.length > 0) {
                res.status(200).json({
                    success: true,
                    count: dbPartners.length,
                    data: dbPartners,
                });
                return;
            }
        }
        const partners = readLocalStore();
        partners.sort((a, b) => (a.order || 0) - (b.order || 0));
        res.status(200).json({
            success: true,
            count: partners.length,
            data: partners,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve all partners.",
            error: error.message,
        });
    }
};
exports.getAllPartners = getAllPartners;
/**
 * Get single partner by ID
 */
const getPartnerById = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, db_1.isDBConnected)()) {
            try {
                const item = await Partner_1.Partner.findById(id);
                if (item) {
                    res.status(200).json({ success: true, data: item });
                    return;
                }
            }
            catch {
                // Fall through to local store
            }
        }
        const partners = readLocalStore();
        const partner = partners.find((p) => p._id === id);
        if (!partner) {
            res.status(404).json({ success: false, message: "Partner not found." });
            return;
        }
        res.status(200).json({ success: true, data: partner });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving partner.",
            error: error.message,
        });
    }
};
exports.getPartnerById = getPartnerById;
/**
 * Create new partner (supports uploaded file or URL)
 */
const createPartner = async (req, res) => {
    try {
        const { name, category = "Industrial Client", website = "", description = "", order = 0, isActive = true, } = req.body;
        let logoUrl = req.body.logoUrl;
        if (req.file) {
            logoUrl = `/uploads/${req.file.filename}`;
        }
        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Partner name is required.",
            });
            return;
        }
        if (!logoUrl) {
            res.status(400).json({
                success: false,
                message: "Partner logo is required (either upload an image or provide a logo URL).",
            });
            return;
        }
        const parsedOrder = parseInt(String(order), 10);
        const activeBool = isActive === "true" || isActive === true;
        const newPartnerData = {
            name: name.trim(),
            category: category.trim() || "Industrial Client",
            logoUrl: logoUrl.trim(),
            website: website ? website.trim() : "",
            description: description ? description.trim() : "",
            order: isNaN(parsedOrder) ? 0 : parsedOrder,
            isActive: activeBool,
        };
        let savedPartner;
        if ((0, db_1.isDBConnected)()) {
            try {
                const partnerDoc = new Partner_1.Partner(newPartnerData);
                savedPartner = await partnerDoc.save();
            }
            catch (dbErr) {
                console.warn("[MongoDB] Create error, falling back to local store:", dbErr.message);
            }
        }
        // Always mirror in local store for seamless offline continuity
        const partners = readLocalStore();
        const localItem = {
            _id: savedPartner ? String(savedPartner._id) : `partner-${Date.now()}`,
            ...newPartnerData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        partners.push(localItem);
        writeLocalStore(partners);
        res.status(201).json({
            success: true,
            message: "Partner added successfully.",
            data: savedPartner || localItem,
        });
    }
    catch (error) {
        console.error("Failed to create partner:", error);
        res.status(400).json({
            success: false,
            message: "Failed to create partner.",
            error: error.message,
        });
    }
};
exports.createPartner = createPartner;
/**
 * Update partner (supports replacing logo with new upload or URL)
 */
const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, website, description, order, isActive, } = req.body;
        let newLogoUrl = req.body.logoUrl;
        if (req.file) {
            newLogoUrl = `/uploads/${req.file.filename}`;
        }
        let updatedDoc = null;
        if ((0, db_1.isDBConnected)()) {
            try {
                const item = await Partner_1.Partner.findById(id);
                if (item) {
                    if (name !== undefined)
                        item.name = name.trim();
                    if (category !== undefined)
                        item.category = category.trim();
                    if (website !== undefined)
                        item.website = website.trim();
                    if (description !== undefined)
                        item.description = description.trim();
                    if (order !== undefined) {
                        const p = parseInt(String(order), 10);
                        if (!isNaN(p))
                            item.order = p;
                    }
                    if (isActive !== undefined) {
                        item.isActive = isActive === "true" || isActive === true;
                    }
                    if (newLogoUrl) {
                        item.logoUrl = newLogoUrl.trim();
                    }
                    updatedDoc = await item.save();
                }
            }
            catch (err) {
                console.warn("[MongoDB] Update error, falling back to local store:", err.message);
            }
        }
        // Update local store as well
        const partners = readLocalStore();
        const index = partners.findIndex((p) => p._id === id);
        if (index === -1 && !updatedDoc) {
            res.status(404).json({ success: false, message: "Partner not found." });
            return;
        }
        if (index !== -1) {
            const existing = partners[index];
            partners[index] = {
                ...existing,
                name: name !== undefined ? name.trim() : existing.name,
                category: category !== undefined ? category.trim() : existing.category,
                website: website !== undefined ? website.trim() : existing.website,
                description: description !== undefined ? description.trim() : existing.description,
                order: order !== undefined ? (isNaN(parseInt(String(order), 10)) ? existing.order : parseInt(String(order), 10)) : existing.order,
                isActive: isActive !== undefined ? (isActive === "true" || isActive === true) : existing.isActive,
                logoUrl: newLogoUrl ? newLogoUrl.trim() : existing.logoUrl,
                updatedAt: new Date().toISOString(),
            };
            writeLocalStore(partners);
        }
        res.status(200).json({
            success: true,
            message: "Partner updated successfully.",
            data: updatedDoc || partners[index],
        });
    }
    catch (error) {
        console.error("Failed to update partner:", error);
        res.status(400).json({
            success: false,
            message: "Failed to update partner.",
            error: error.message,
        });
    }
};
exports.updatePartner = updatePartner;
/**
 * Delete partner
 */
const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        let deletedLogoUrl;
        if ((0, db_1.isDBConnected)()) {
            try {
                const item = await Partner_1.Partner.findByIdAndDelete(id);
                if (item) {
                    deletedLogoUrl = item.logoUrl;
                }
            }
            catch (err) {
                console.warn("[MongoDB] Delete error, checking local store:", err.message);
            }
        }
        const partners = readLocalStore();
        const index = partners.findIndex((p) => p._id === id);
        if (index !== -1) {
            deletedLogoUrl = deletedLogoUrl || partners[index].logoUrl;
            partners.splice(index, 1);
            writeLocalStore(partners);
        }
        // Delete local file if it was uploaded
        if (deletedLogoUrl && deletedLogoUrl.startsWith("/uploads/")) {
            const filename = deletedLogoUrl.replace("/uploads/", "");
            const fullPath = path_1.default.join(uploadDir, filename);
            if (fs_1.default.existsSync(fullPath)) {
                try {
                    fs_1.default.unlinkSync(fullPath);
                }
                catch {
                    // Ignore file delete errors
                }
            }
        }
        res.status(200).json({
            success: true,
            message: "Partner deleted successfully.",
        });
    }
    catch (error) {
        console.error("Failed to delete partner:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete partner.",
            error: error.message,
        });
    }
};
exports.deletePartner = deletePartner;
/**
 * Toggle active status
 */
const togglePartnerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        let newStatus = true;
        if ((0, db_1.isDBConnected)()) {
            try {
                const item = await Partner_1.Partner.findById(id);
                if (item) {
                    item.isActive = !item.isActive;
                    await item.save();
                    newStatus = item.isActive;
                }
            }
            catch {
                // Fallback
            }
        }
        const partners = readLocalStore();
        const index = partners.findIndex((p) => p._id === id);
        if (index !== -1) {
            partners[index].isActive = !partners[index].isActive;
            newStatus = partners[index].isActive;
            partners[index].updatedAt = new Date().toISOString();
            writeLocalStore(partners);
        }
        res.status(200).json({
            success: true,
            message: `Partner status changed to ${newStatus ? "Active" : "Inactive"}.`,
            isActive: newStatus,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to toggle partner status.",
            error: error.message,
        });
    }
};
exports.togglePartnerStatus = togglePartnerStatus;
//# sourceMappingURL=partnerController.js.map
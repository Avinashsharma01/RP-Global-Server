"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertificate = exports.updateCertificate = exports.createCertificate = exports.getCertificateById = exports.getCertificates = exports.DEFAULT_CERTIFICATES = void 0;
const Certificate_1 = require("../models/Certificate");
const db_1 = require("../config/db");
// Initial 5 Authentic RP Global Certificates (seeded if collection is empty)
exports.DEFAULT_CERTIFICATES = [
    {
        title: "ISO 9001:2015 Quality Management System",
        subtitle: "Turnkey Water & Wastewater Treatment Plants EPC",
        issuingAuthority: "Magnitude Management Services Pvt. Ltd. (EGAC & IAF Accredited)",
        certificateNumber: "20EQCK10",
        category: "ISO",
        issueDate: "2023-08-05",
        expiryDate: "2026-08-04",
        imageUrl: "/images/certificates/iso-9001-2015.svg",
        verificationUrl: "https://www.mmsintl.com",
        description: "Manufacture & Supplier of Water and Waste Water Treatment Plants like STP, ETP, WTP, Domestic & Industrial RO Plant, Water Softener, DM Plant and related civil engineering works.",
        order: 1,
        isActive: true,
        isFeatured: true,
    },
    {
        title: "Government of India — Importer-Exporter Code (IEC)",
        subtitle: "Directorate General of Foreign Trade (DGFT), Ministry of Commerce & Industry",
        issuingAuthority: "Office of the Additional DGFT, Govt. of India",
        certificateNumber: "0212019727",
        category: "GOVERNMENT",
        issueDate: "2023-05-18",
        expiryDate: "Permanent / Active",
        imageUrl: "/images/certificates/iec-dgft-govt.svg",
        verificationUrl: "https://dgft.gov.in",
        description: "Official Government of India Importer-Exporter Code granting authorized import of specialized membrane elements, high-pressure pumps, and advanced industrial water purification components.",
        order: 2,
        isActive: true,
        isFeatured: true,
    },
    {
        title: "Employees' State Insurance Corporation (ESIC)",
        subtitle: "Statutory Social Security & Health Insurance Implementation",
        issuingAuthority: "Regional Office, Ministry of Labour & Employment, Govt. of India",
        certificateNumber: "ESI-11000582960000606",
        category: "LABOUR",
        issueDate: "2023-06-12",
        expiryDate: "Permanent / Active",
        imageUrl: "/images/certificates/esic-registration.svg",
        verificationUrl: "https://www.esic.gov.in",
        description: "Statutory implementation under Section 1(3) of the E.S.I. Act, 1948 ensuring verified on-site worker safety, medical healthcare, and statutory welfare across all construction and erection projects.",
        order: 3,
        isActive: true,
        isFeatured: true,
    },
    {
        title: "Employees' Provident Fund Organisation (EPFO)",
        subtitle: "Ministry of Labour and Employment, Govt. of India",
        issuingAuthority: "EPFO Regional Office (Statutory Body under Govt. of India)",
        certificateNumber: "GNGGN1344804000",
        category: "LABOUR",
        issueDate: "2023-05-28",
        expiryDate: "Permanent / Active",
        imageUrl: "/images/certificates/epfo-registration.svg",
        verificationUrl: "https://www.epfindia.gov.in",
        description: "Allotment of Code Number under the Employees' Provident Fund and Miscellaneous Provisions Act, 1952 ensuring 100% compliance with labor laws and skilled engineering workforce protections.",
        order: 4,
        isActive: true,
        isFeatured: true,
    },
    {
        title: "Government of Haryana — Engineering Works Portal",
        subtitle: "Contractor Profile Summary — HEWP Works Portal",
        issuingAuthority: "Haryana Engineering Works Portal, Government of Haryana",
        certificateNumber: "2004918724",
        category: "CONTRACTOR",
        issueDate: "2024-01-15",
        expiryDate: "2027-01-14",
        imageUrl: "/images/certificates/hewp-haryana-contractor.svg",
        verificationUrl: "https://works.haryana.gov.in",
        description: "Verified Government Contractor registration for Public Health Engineering, Municipal Water Supply, Irrigation, and Civil Works across Haryana state infrastructural schemes.",
        order: 5,
        isActive: true,
        isFeatured: true,
    },
    {
        title: "CPCB Environmental Technology Compliance",
        subtitle: "Central Pollution Control Board, MoEFCC, Govt. of India",
        issuingAuthority: "Central Pollution Control Board (CPCB), New Delhi",
        certificateNumber: "CPCB/IPC-VII/Wastewater/8892",
        category: "COMPLIANCE",
        issueDate: "2023-09-14",
        expiryDate: "2028-09-13",
        imageUrl: "/images/certificates/cpcb-environmental-compliance.svg",
        verificationUrl: "https://cpcb.nic.in",
        description: "Standard Operating Procedure (SOP) compliance certificate for industrial wastewater recycling, Zero Liquid Discharge (ZLD) plants, and strict adherence to CPCB environmental standards.",
        order: 6,
        isActive: true,
        isFeatured: true,
    },
    {
        title: "MSME Udyam Registration Certificate",
        subtitle: "Ministry of Micro, Small and Medium Enterprises, Govt. of India",
        issuingAuthority: "Ministry of MSME, Govt. of India",
        certificateNumber: "UDYAM-HR-04-0048291",
        category: "GOVERNMENT",
        issueDate: "2019-02-20",
        expiryDate: "Permanent / Active",
        imageUrl: "/images/certificates/msme-udyam-registration.svg",
        verificationUrl: "https://udyamregistration.gov.in",
        description: "Statutory MSME registration for water purification plant fabrication, membrane filtration skid manufacturing, and municipal utility works execution.",
        order: 7,
        isActive: true,
        isFeatured: true,
    },
];
// In-memory store fallback when MongoDB is running in offline mode
let inMemoryCertificates = exports.DEFAULT_CERTIFICATES.map((c, i) => ({
    ...c,
    _id: `cert-local-${i + 1}`,
    createdAt: new Date(Date.now() - (5 - i) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
}));
/**
 * Public & Admin: Fetch all certificates
 */
const getCertificates = async (req, res) => {
    try {
        const { category, search, includeInactive } = req.query;
        if (!(0, db_1.isDBConnected)()) {
            let list = [...inMemoryCertificates];
            if (includeInactive !== "true") {
                list = list.filter((c) => c.isActive !== false);
            }
            if (category && category !== "ALL") {
                list = list.filter((c) => c.category === category);
            }
            if (search && typeof search === "string" && search.trim()) {
                const q = search.trim().toLowerCase();
                list = list.filter((c) => (c.title || "").toLowerCase().includes(q) ||
                    (c.certificateNumber || "").toLowerCase().includes(q) ||
                    (c.issuingAuthority || "").toLowerCase().includes(q));
            }
            list.sort((a, b) => (a.order || 0) - (b.order || 0));
            res.status(200).json({
                success: true,
                count: list.length,
                data: list,
            });
            return;
        }
        const filter = {};
        if (includeInactive !== "true") {
            filter.isActive = true;
        }
        if (category && category !== "ALL") {
            filter.category = category;
        }
        if (search && typeof search === "string" && search.trim()) {
            const q = search.trim();
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { certificateNumber: { $regex: q, $options: "i" } },
                { issuingAuthority: { $regex: q, $options: "i" } },
            ];
        }
        let items = await Certificate_1.Certificate.find(filter).sort({ order: 1, createdAt: -1 });
        // Auto-seed if database is completely empty
        if (items.length === 0 && (!category || category === "ALL") && !search) {
            const totalCount = await Certificate_1.Certificate.countDocuments();
            if (totalCount === 0) {
                await Certificate_1.Certificate.insertMany(exports.DEFAULT_CERTIFICATES);
                items = await Certificate_1.Certificate.find(filter).sort({ order: 1, createdAt: -1 });
            }
        }
        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificates.",
            error: error.message,
        });
    }
};
exports.getCertificates = getCertificates;
/**
 * Public: Fetch single certificate by ID
 */
const getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, db_1.isDBConnected)()) {
            const found = inMemoryCertificates.find((c) => c._id === id);
            if (!found) {
                res.status(404).json({ success: false, message: "Certificate not found." });
                return;
            }
            res.status(200).json({ success: true, data: found });
            return;
        }
        const item = await Certificate_1.Certificate.findById(id);
        if (!item) {
            res.status(404).json({ success: false, message: "Certificate not found." });
            return;
        }
        res.status(200).json({
            success: true,
            data: item,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificate.",
            error: error.message,
        });
    }
};
exports.getCertificateById = getCertificateById;
/**
 * Admin: Create a new certificate
 */
const createCertificate = async (req, res) => {
    try {
        const { title, subtitle, issuingAuthority, certificateNumber, category = "COMPLIANCE", issueDate, expiryDate, description, order = 0, isActive = true, isFeatured = true, verificationUrl, pdfUrl, } = req.body;
        let imageUrl = req.body.imageUrl;
        // Check for uploaded files
        const files = req.files;
        if (files) {
            if (files["image"]?.[0]) {
                imageUrl = `/uploads/${files["image"][0].filename}`;
            }
            else if (files["certificate"]?.[0]) {
                imageUrl = `/uploads/${files["certificate"][0].filename}`;
            }
            else if (files["file"]?.[0]) {
                imageUrl = `/uploads/${files["file"][0].filename}`;
            }
        }
        else if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        if (!title || !issuingAuthority || !certificateNumber) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: title, issuingAuthority, and certificateNumber.",
            });
            return;
        }
        if (!imageUrl) {
            imageUrl = "/images/certificates/iso-9001-2015.svg"; // Fallback placeholder
        }
        if (!(0, db_1.isDBConnected)()) {
            const newCert = {
                _id: `cert-local-${Date.now()}`,
                title,
                subtitle: subtitle || "",
                issuingAuthority,
                certificateNumber,
                category,
                issueDate: issueDate || "",
                expiryDate: expiryDate || "Permanent / Active",
                imageUrl,
                pdfUrl: pdfUrl || "",
                verificationUrl: verificationUrl || "",
                description: description || "",
                order: parseInt(String(order), 10) || 0,
                isActive: isActive === "true" || isActive === true,
                isFeatured: isFeatured === "true" || isFeatured === true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            inMemoryCertificates.unshift(newCert);
            res.status(201).json({
                success: true,
                message: "Certificate uploaded and saved successfully.",
                data: newCert,
            });
            return;
        }
        const certificate = new Certificate_1.Certificate({
            title,
            subtitle: subtitle || "",
            issuingAuthority,
            certificateNumber,
            category,
            issueDate: issueDate || "",
            expiryDate: expiryDate || "Permanent / Active",
            imageUrl,
            pdfUrl: pdfUrl || "",
            verificationUrl: verificationUrl || "",
            description: description || "",
            order: parseInt(String(order), 10) || 0,
            isActive: isActive === "true" || isActive === true,
            isFeatured: isFeatured === "true" || isFeatured === true,
        });
        await certificate.save();
        res.status(201).json({
            success: true,
            message: "Certificate uploaded and saved successfully.",
            data: certificate,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create certificate.",
            error: error.message,
        });
    }
};
exports.createCertificate = createCertificate;
/**
 * Admin: Update existing certificate
 */
const updateCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        let resolveImageUrl = req.body.imageUrl;
        const files = req.files;
        if (files) {
            if (files["image"]?.[0]) {
                resolveImageUrl = `/uploads/${files["image"][0].filename}`;
            }
            else if (files["certificate"]?.[0]) {
                resolveImageUrl = `/uploads/${files["certificate"][0].filename}`;
            }
            else if (files["file"]?.[0]) {
                resolveImageUrl = `/uploads/${files["file"][0].filename}`;
            }
        }
        else if (req.file) {
            resolveImageUrl = `/uploads/${req.file.filename}`;
        }
        if (!(0, db_1.isDBConnected)()) {
            const idx = inMemoryCertificates.findIndex((c) => c._id === id);
            if (idx === -1) {
                res.status(404).json({ success: false, message: "Certificate not found." });
                return;
            }
            const existing = inMemoryCertificates[idx];
            inMemoryCertificates[idx] = {
                ...existing,
                ...req.body,
                order: req.body.order !== undefined ? parseInt(String(req.body.order), 10) : existing.order,
                isActive: req.body.isActive !== undefined ? (req.body.isActive === "true" || req.body.isActive === true) : existing.isActive,
                isFeatured: req.body.isFeatured !== undefined ? (req.body.isFeatured === "true" || req.body.isFeatured === true) : existing.isFeatured,
                imageUrl: resolveImageUrl || existing.imageUrl,
                updatedAt: new Date().toISOString(),
            };
            res.status(200).json({
                success: true,
                message: "Certificate updated successfully.",
                data: inMemoryCertificates[idx],
            });
            return;
        }
        const certificate = await Certificate_1.Certificate.findById(id);
        if (!certificate) {
            res.status(404).json({ success: false, message: "Certificate not found." });
            return;
        }
        const { title, subtitle, issuingAuthority, certificateNumber, category, issueDate, expiryDate, description, order, isActive, isFeatured, verificationUrl, pdfUrl, } = req.body;
        if (title !== undefined)
            certificate.title = title;
        if (subtitle !== undefined)
            certificate.subtitle = subtitle;
        if (issuingAuthority !== undefined)
            certificate.issuingAuthority = issuingAuthority;
        if (certificateNumber !== undefined)
            certificate.certificateNumber = certificateNumber;
        if (category !== undefined)
            certificate.category = category;
        if (issueDate !== undefined)
            certificate.issueDate = issueDate;
        if (expiryDate !== undefined)
            certificate.expiryDate = expiryDate;
        if (description !== undefined)
            certificate.description = description;
        if (verificationUrl !== undefined)
            certificate.verificationUrl = verificationUrl;
        if (pdfUrl !== undefined)
            certificate.pdfUrl = pdfUrl;
        if (order !== undefined)
            certificate.order = parseInt(String(order), 10) || 0;
        if (isActive !== undefined)
            certificate.isActive = isActive === "true" || isActive === true;
        if (isFeatured !== undefined)
            certificate.isFeatured = isFeatured === "true" || isFeatured === true;
        if (resolveImageUrl)
            certificate.imageUrl = resolveImageUrl;
        await certificate.save();
        res.status(200).json({
            success: true,
            message: "Certificate updated successfully.",
            data: certificate,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update certificate.",
            error: error.message,
        });
    }
};
exports.updateCertificate = updateCertificate;
/**
 * Admin: Delete certificate
 */
const deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, db_1.isDBConnected)()) {
            const prevLen = inMemoryCertificates.length;
            inMemoryCertificates = inMemoryCertificates.filter((c) => c._id !== id);
            if (inMemoryCertificates.length === prevLen) {
                res.status(404).json({ success: false, message: "Certificate not found." });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Certificate deleted successfully.",
            });
            return;
        }
        const certificate = await Certificate_1.Certificate.findByIdAndDelete(id);
        if (!certificate) {
            res.status(404).json({ success: false, message: "Certificate not found." });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Certificate deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete certificate.",
            error: error.message,
        });
    }
};
exports.deleteCertificate = deleteCertificate;
//# sourceMappingURL=certificateController.js.map
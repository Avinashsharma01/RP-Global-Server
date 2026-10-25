"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSummary = void 0;
const Lead_1 = require("../models/Lead");
const JobOpening_1 = require("../models/JobOpening");
const JobApplication_1 = require("../models/JobApplication");
const Product_1 = require("../models/Product");
const getAdminSummary = async (_req, res) => {
    try {
        const [totalLeads, newLeads, evaluationLeads, wonLeads, totalJobs, activeJobs, totalApplications, totalProducts, recentLeads, recentApplications,] = await Promise.all([
            Lead_1.Lead.countDocuments(),
            Lead_1.Lead.countDocuments({ status: "NEW" }),
            Lead_1.Lead.countDocuments({ status: "TECHNICAL_EVALUATION" }),
            Lead_1.Lead.countDocuments({ status: "WON" }),
            JobOpening_1.JobOpening.countDocuments(),
            JobOpening_1.JobOpening.countDocuments({ isActive: true }),
            JobApplication_1.JobApplication.countDocuments(),
            Product_1.Product.countDocuments(),
            Lead_1.Lead.find().sort({ createdAt: -1 }).limit(5),
            JobApplication_1.JobApplication.find().sort({ createdAt: -1 }).limit(5),
        ]);
        // Aggregations for chart analytics
        const [leadsByCategory, leadsByStatus, monthlyLeadTrends,] = await Promise.all([
            Lead_1.Lead.aggregate([
                { $group: { _id: "$plantCategory", count: { $sum: 1 }, totalValue: { $sum: "$estimatedValueINR" } } },
                { $sort: { count: -1 } },
            ]).catch(() => []),
            Lead_1.Lead.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]).catch(() => []),
            Lead_1.Lead.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                { $limit: 12 },
            ]).catch(() => []),
        ]);
        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalLeads,
                    newLeads,
                    evaluationLeads,
                    wonLeads,
                    totalJobs,
                    activeJobs,
                    totalApplications,
                    totalProducts,
                },
                analytics: {
                    leadsByCategory,
                    leadsByStatus,
                    monthlyLeadTrends,
                },
                recentLeads,
                recentApplications,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to compile admin analytics summary.",
            error: error.message,
        });
    }
};
exports.getAdminSummary = getAdminSummary;
//# sourceMappingURL=adminController.js.map
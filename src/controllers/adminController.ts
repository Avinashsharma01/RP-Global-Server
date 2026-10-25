import { Response } from "express";
import { Lead } from "../models/Lead";
import { JobOpening } from "../models/JobOpening";
import { JobApplication } from "../models/JobApplication";
import { Product } from "../models/Product";
import { AuthenticatedRequest } from "../middlewares/auth";

export const getAdminSummary = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const [
      totalLeads,
      newLeads,
      evaluationLeads,
      wonLeads,
      totalJobs,
      activeJobs,
      totalApplications,
      totalProducts,
      recentLeads,
      recentApplications,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "NEW" }),
      Lead.countDocuments({ status: "TECHNICAL_EVALUATION" }),
      Lead.countDocuments({ status: "WON" }),
      JobOpening.countDocuments(),
      JobOpening.countDocuments({ isActive: true }),
      JobApplication.countDocuments(),
      Product.countDocuments(),
      Lead.find().sort({ createdAt: -1 }).limit(5),
      JobApplication.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Aggregations for chart analytics
    const [
      leadsByCategory,
      leadsByStatus,
      monthlyLeadTrends,
    ] = await Promise.all([
      Lead.aggregate([
        { $group: { _id: "$plantCategory", count: { $sum: 1 }, totalValue: { $sum: "$estimatedValueINR" } } },
        { $sort: { count: -1 } },
      ]).catch(() => []),
      Lead.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).catch(() => []),
      Lead.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to compile admin analytics summary.",
      error: error.message,
    });
  }
};

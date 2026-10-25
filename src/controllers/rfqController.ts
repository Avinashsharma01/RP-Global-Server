import { Request, Response } from "express";
import { Lead } from "../models/Lead";
import { AuthenticatedRequest } from "../middlewares/auth";

export const submitRFQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      plantCategory,
      requiredCapacityKLD,
      rawWaterSource,
      projectLocation,
      message,
      source,
    } = req.body;

    if (!fullName || !companyName || !email || !phone || !plantCategory) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: fullName, companyName, email, phone, and plantCategory are required.",
      });
      return;
    }

    // Parse inletParameters if passed as stringified JSON or object
    let inletParameters = undefined;
    if (req.body.inletParameters) {
      if (typeof req.body.inletParameters === "string") {
        try {
          inletParameters = JSON.parse(req.body.inletParameters);
        } catch {
          inletParameters = undefined;
        }
      } else {
        inletParameters = req.body.inletParameters;
      }
    }

    // Check if water test report file was attached
    let attachedReportUrl = undefined;
    let attachedReportFilename = undefined;
    if (req.file) {
      attachedReportUrl = `/uploads/${req.file.filename}`;
      attachedReportFilename = req.file.originalname;
    }

    const lead = new Lead({
      fullName,
      companyName,
      email,
      phone,
      plantCategory,
      requiredCapacityKLD,
      rawWaterSource,
      inletParameters,
      projectLocation,
      message,
      attachedReportUrl,
      attachedReportFilename,
      source: source || "Website RFQ Portal",
      status: "NEW",
    });

    await lead.save();

    res.status(201).json({
      success: true,
      message:
        "Thank you! Your Technical RFQ has been registered. Our engineering desk will review your water parameters and contact you shortly.",
      leadId: lead._id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to submit RFQ inquiry.",
      error: error.message,
    });
  }
};

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, category, search, priority, page = "1", limit = "20" } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.plantCategory = category;
    if (priority) filter.priority = priority;

    if (search && typeof search === "string") {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve leads.",
      error: error.message,
    });
  }
};

export const getLeadById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found." });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead details.",
      error: error.message,
    });
  }
};

export const updateLeadStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, priority, estimatedValueINR } = req.body;

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;
    if (estimatedValueINR !== undefined) updateFields.estimatedValueINR = estimatedValueINR;

    const lead = await Lead.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead status updated.",
      data: lead,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update lead status.",
      error: error.message,
    });
  }
};

export const addLeadNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || typeof note !== "string" || !note.trim()) {
      res.status(400).json({ success: false, message: "Note text is required." });
      return;
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found." });
      return;
    }

    const authorName = req.user?.fullName || "Admin Team";
    lead.internalNotes.push({
      text: note.trim(),
      author: authorName,
      createdAt: new Date(),
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Internal note added.",
      data: lead,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to add internal note.",
      error: error.message,
    });
  }
};

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lead.",
      error: error.message,
    });
  }
};

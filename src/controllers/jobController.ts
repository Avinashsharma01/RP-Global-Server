import { Request, Response } from "express";
import { JobOpening } from "../models/JobOpening";
import { JobApplication } from "../models/JobApplication";
import { AuthenticatedRequest } from "../middlewares/auth";

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, includeInactive } = req.query;

    const filter: any = {};
    if (includeInactive !== "true") {
      filter.isActive = true;
    }
    if (department) {
      filter.department = department;
    }

    const jobs = await JobOpening.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job openings.",
      error: error.message,
    });
  }
};

export const getJobBySlugOrId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const identifier = String(req.params.identifier);

    // Check if identifier is ObjectId or slug
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const filter = isObjectId ? { _id: identifier } : { slug: identifier.toLowerCase() };

    const job = await JobOpening.findOne(filter);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job opening not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job details.",
      error: error.message,
    });
  }
};

export const applyForJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id || "");
    const {
      fullName,
      email,
      phone,
      currentCompany,
      currentCtc,
      expectedCtc,
      noticePeriodDays,
      experienceYears,
      coverNote,
    } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({
        success: false,
        message: "Candidate full name, email, and phone number are required.",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please upload your resume document (PDF, DOC, or DOCX).",
      });
      return;
    }

    const isObjectId = id && /^[0-9a-fA-F]{24}$/.test(id);
    let job = null;

    if (isObjectId) {
      job = await JobOpening.findById(id);
    }

    if (!job) {
      const slugCandidate = id.toLowerCase().trim();
      job = await JobOpening.findOne({
        $or: [
          { slug: slugCandidate },
          { title: new RegExp(id.replace(/[-_]/g, " "), "i") },
        ],
      });
    }

    if (!job) {
      const mockJobMap: Record<string, string> = {
        "job-1": "senior-water-treatment-process-engineer",
        "job-2": "stp-etp-plant-commissioning-specialist",
        "job-3": "sales-manager-water-epc",
      };
      if (mockJobMap[id]) {
        job = await JobOpening.findOne({ slug: mockJobMap[id] });
      }
    }

    if (!job) {
      job = await JobOpening.findOne({ isActive: true });
    }

    if (!job) {
      res.status(404).json({
        success: false,
        message: "The job opening you are applying for was not found.",
      });
      return;
    }

    const resumeUrl = `/uploads/${req.file.filename}`;
    const resumeFilename = req.file.originalname;

    const application = new JobApplication({
      jobOpeningId: job._id,
      jobTitle: job.title,
      fullName,
      email,
      phone,
      currentCompany,
      currentCtc,
      expectedCtc,
      noticePeriodDays: noticePeriodDays ? parseInt(noticePeriodDays, 10) : 30,
      experienceYears,
      resumeUrl,
      resumeFilename,
      coverNote,
      status: "SUBMITTED",
    });

    await application.save();

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully! Our recruitment team will review your CV.",
      applicationId: application._id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to submit job application.",
      error: error.message,
    });
  }
};

export const createJob = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const job = new JobOpening(req.body);
    await job.save();

    res.status(201).json({
      success: true,
      message: "Job opening created successfully.",
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create job opening.",
      error: error.message,
    });
  }
};

export const updateJob = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await JobOpening.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      res.status(404).json({ success: false, message: "Job opening not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job opening updated successfully.",
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update job opening.",
      error: error.message,
    });
  }
};

export const deleteJob = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await JobOpening.findByIdAndDelete(id);

    if (!job) {
      res.status(404).json({ success: false, message: "Job opening not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job opening deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job opening.",
      error: error.message,
    });
  }
};

export const getJobApplications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobId, status } = req.query;

    const filter: any = {};
    if (jobId) filter.jobOpeningId = jobId;
    if (status) filter.status = status;

    const applications = await JobApplication.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve job applications.",
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const application = await JobApplication.findById(id);
    if (!application) {
      res.status(404).json({ success: false, message: "Application not found." });
      return;
    }

    if (status) {
      application.status = status;
    }

    if (note) {
      application.internalNotes.push({
        text: note,
        author: req.user?.fullName || "HR Team",
        createdAt: new Date(),
      });
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update application status.",
      error: error.message,
    });
  }
};

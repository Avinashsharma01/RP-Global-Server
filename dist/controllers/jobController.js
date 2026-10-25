"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getJobApplications = exports.deleteJob = exports.updateJob = exports.createJob = exports.applyForJob = exports.getJobBySlugOrId = exports.getJobs = void 0;
const JobOpening_1 = require("../models/JobOpening");
const JobApplication_1 = require("../models/JobApplication");
const getJobs = async (req, res) => {
    try {
        const { department, includeInactive } = req.query;
        const filter = {};
        if (includeInactive !== "true") {
            filter.isActive = true;
        }
        if (department) {
            filter.department = department;
        }
        const jobs = await JobOpening_1.JobOpening.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch job openings.",
            error: error.message,
        });
    }
};
exports.getJobs = getJobs;
const getJobBySlugOrId = async (req, res) => {
    try {
        const identifier = String(req.params.identifier);
        // Check if identifier is ObjectId or slug
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        const filter = isObjectId ? { _id: identifier } : { slug: identifier.toLowerCase() };
        const job = await JobOpening_1.JobOpening.findOne(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch job details.",
            error: error.message,
        });
    }
};
exports.getJobBySlugOrId = getJobBySlugOrId;
const applyForJob = async (req, res) => {
    try {
        const id = String(req.params.id || "");
        const { fullName, email, phone, currentCompany, currentCtc, expectedCtc, noticePeriodDays, experienceYears, coverNote, } = req.body;
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
            job = await JobOpening_1.JobOpening.findById(id);
        }
        if (!job) {
            const slugCandidate = id.toLowerCase().trim();
            job = await JobOpening_1.JobOpening.findOne({
                $or: [
                    { slug: slugCandidate },
                    { title: new RegExp(id.replace(/[-_]/g, " "), "i") },
                ],
            });
        }
        if (!job) {
            const mockJobMap = {
                "job-1": "senior-water-treatment-process-engineer",
                "job-2": "stp-etp-plant-commissioning-specialist",
                "job-3": "sales-manager-water-epc",
            };
            if (mockJobMap[id]) {
                job = await JobOpening_1.JobOpening.findOne({ slug: mockJobMap[id] });
            }
        }
        if (!job) {
            job = await JobOpening_1.JobOpening.findOne({ isActive: true });
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
        const application = new JobApplication_1.JobApplication({
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
            message: "Application submitted successfully! Our recruitment team will review your CV.",
            applicationId: application._id,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit job application.",
            error: error.message,
        });
    }
};
exports.applyForJob = applyForJob;
const createJob = async (req, res) => {
    try {
        const job = new JobOpening_1.JobOpening(req.body);
        await job.save();
        res.status(201).json({
            success: true,
            message: "Job opening created successfully.",
            data: job,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create job opening.",
            error: error.message,
        });
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await JobOpening_1.JobOpening.findByIdAndUpdate(id, req.body, {
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update job opening.",
            error: error.message,
        });
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await JobOpening_1.JobOpening.findByIdAndDelete(id);
        if (!job) {
            res.status(404).json({ success: false, message: "Job opening not found." });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Job opening deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete job opening.",
            error: error.message,
        });
    }
};
exports.deleteJob = deleteJob;
const getJobApplications = async (req, res) => {
    try {
        const { jobId, status } = req.query;
        const filter = {};
        if (jobId)
            filter.jobOpeningId = jobId;
        if (status)
            filter.status = status;
        const applications = await JobApplication_1.JobApplication.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve job applications.",
            error: error.message,
        });
    }
};
exports.getJobApplications = getJobApplications;
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;
        const application = await JobApplication_1.JobApplication.findById(id);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update application status.",
            error: error.message,
        });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
//# sourceMappingURL=jobController.js.map
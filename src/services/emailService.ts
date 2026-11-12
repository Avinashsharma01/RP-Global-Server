import nodemailer, { Transporter } from "nodemailer";

interface LeadData {
  _id: string | any;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  plantCategory: string;
  requiredCapacityKLD?: string;
  rawWaterSource?: string;
  projectLocation?: string;
  message?: string;
  inletParameters?: Record<string, any>;
  attachedReportUrl?: string;
  attachedReportFilename?: string;
  source?: string;
}

interface ApplicationData {
  _id: string | any;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriodDays?: number;
  experienceYears?: string;
  coverNote?: string;
  resumeUrl?: string;
  resumeFilename?: string;
}

const isConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

let transporter: Transporter | null = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const DEFAULT_FROM =
  process.env.SMTP_FROM || `"R P Global Projects" <info@rpglobalprojects.com>`;
const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "info@rpglobalprojects.com";

const baseEmailShell = (title: string, content: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: #0A192F; padding: 24px 30px; text-align: left; border-bottom: 3px solid #00E5FF; }
    .brand-name { font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1px; margin: 0; }
    .brand-tag { font-size: 11px; font-weight: 600; color: #00E5FF; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
    .content { padding: 30px; line-height: 1.6; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase; background: #e0f2fe; color: #0369a1; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .table td.label { font-weight: 600; color: #64748b; width: 38%; }
    .table td.value { color: #0f172a; font-weight: 500; }
    .cta-btn { display: inline-block; padding: 12px 24px; background: #0077B6; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; margin: 15px 0; text-align: center; }
    .footer { background: #020C1B; padding: 24px 30px; color: #94a3b8; font-size: 11px; line-height: 1.6; }
    .footer a { color: #00E5FF; text-decoration: none; }
    .office-block { margin-top: 10px; padding-top: 10px; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-name">R P GLOBAL PROJECTS</div>
      <div class="brand-tag">ISO 9001:2015 Turnkey Water & Wastewater EPC</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <strong>R P GLOBAL PROJECTS</strong> — Environmental Water Engineering & EPC Solutions<br>
      Emergency & Engineering Desk: <a href="tel:+917739283565">+91 7739283565</a> | <a href="mailto:info@rpglobalprojects.com">info@rpglobalprojects.com</a>
      <div class="office-block">
        <strong>Corporate Office:</strong> C-78, Cabin No-6, 2nd Floor, Sector-2, Noida, UP – 201301<br>
        <strong>Head / Registered Office:</strong> Vill- Mahuawan, Dist- Gopalganj, Bihar – 841437
      </div>
    </div>
  </div>
</body>
</html>
`;

export const emailService = {
  /**
   * Alert the internal sales & engineering desk of a new client RFQ inquiry
   */
  sendNewRFQToAdmin: async (lead: LeadData): Promise<boolean> => {
    const title = `New RFQ: ${lead.plantCategory} from ${lead.companyName}`;
    const reportHtml = lead.attachedReportUrl
      ? `<p><a href="${lead.attachedReportUrl}" class="cta-btn" target="_blank">📄 View Attached Water Test Report</a></p>`
      : `<p style="color: #64748b; font-size: 12px;"><em>No water test report attached.</em></p>`;

    const inletHtml = lead.inletParameters
      ? `<div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 10px 0; font-size: 12px;">
           <strong>Provided Raw Water Chemistry:</strong><br>
           ${Object.entries(lead.inletParameters)
             .map(([k, v]) => `• ${k}: <strong>${v}</strong>`)
             .join("<br>")}
         </div>`
      : "";

    const html = baseEmailShell(
      title,
      `
      <div style="margin-bottom: 15px;">
        <span class="badge">New Engineering RFQ Lead</span>
        <h2 style="margin: 8px 0 0 0; color: #0A192F; font-size: 18px;">${lead.companyName}</h2>
      </div>
      <p>A new technical quotation request was submitted via the <strong>${lead.source || "Website RFQ Portal"}</strong>.</p>
      
      <table class="table">
        <tr><td class="label">Client Contact</td><td class="value">${lead.fullName}</td></tr>
        <tr><td class="label">Company / Entity</td><td class="value">${lead.companyName}</td></tr>
        <tr><td class="label">Email Address</td><td class="value"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td class="label">Direct Phone</td><td class="value"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
        <tr><td class="label">Required Plant</td><td class="value"><strong>${lead.plantCategory}</strong></td></tr>
        <tr><td class="label">Design Capacity</td><td class="value">${lead.requiredCapacityKLD || "To be calculated"}</td></tr>
        <tr><td class="label">Raw Water Source</td><td class="value">${lead.rawWaterSource || "Not specified"}</td></tr>
        <tr><td class="label">Project Location</td><td class="value">${lead.projectLocation || "Not specified"}</td></tr>
      </table>

      ${inletHtml}

      ${lead.message ? `<div style="margin: 15px 0;"><strong>Client Requirement Remarks:</strong><p style="background: #f1f5f9; padding: 12px; border-radius: 6px; margin-top: 5px;">${lead.message}</p></div>` : ""}

      ${reportHtml}

      <p style="margin-top: 25px; font-size: 12px; color: #64748b;">
        Lead ID: <code>${lead._id}</code><br>
        Access this inquiry inside the <a href="http://localhost:3000/admin/leads">Admin CRM Portal</a>.
      </p>
    `
    );

    if (!isConfigured || !transporter) {
      console.log(`[Email Service (Dev)] Dispatched Admin Alert for RFQ Lead [${lead._id}]:`);
      console.log(`  To: ${ADMIN_EMAIL}`);
      console.log(`  Subject: [New RFQ] ${lead.plantCategory} - ${lead.companyName}`);
      console.log(`  Report URL: ${lead.attachedReportUrl || "None"}`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: ADMIN_EMAIL,
        subject: `[New RFQ Inquiry] ${lead.plantCategory} (${lead.requiredCapacityKLD || "Custom"}) — ${lead.companyName}`,
        html,
      });
      return true;
    } catch (err: any) {
      console.error("[Email Service Error] Failed to send admin RFQ email:", err.message);
      return false;
    }
  },

  /**
   * Send instant formal acknowledgement and quotation reference receipt to the client
   */
  sendRFQConfirmationToClient: async (lead: LeadData): Promise<boolean> => {
    const refCode = String(lead._id).slice(-6).toUpperCase();
    const title = `Quotation Request Received (Ref #${refCode}) — R P Global Projects`;

    const html = baseEmailShell(
      title,
      `
      <div style="margin-bottom: 15px;">
        <span class="badge" style="background: #ecfdf5; color: #047857;">Technical Ingestion Confirmed</span>
        <h2 style="margin: 8px 0 0 0; color: #0A192F; font-size: 18px;">Thank You, ${lead.fullName}</h2>
      </div>
      <p>Dear ${lead.fullName},</p>
      <p>We have successfully received your technical quotation inquiry for <strong>${lead.plantCategory}</strong> on behalf of <strong>${lead.companyName}</strong>.</p>
      
      <div style="background: #f8fafc; border-left: 4px solid #0077B6; padding: 15px; margin: 20px 0;">
        <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700;">Your RFQ Tracking Reference</div>
        <div style="font-size: 22px; font-weight: 800; color: #0077B6; letter-spacing: 1px;">#RPG-${refCode}</div>
      </div>

      <h3 style="color: #0A192F; font-size: 14px; margin-top: 20px;">What Happens Next?</h3>
      <ol style="padding-left: 20px; line-height: 1.8; color: #334155;">
        <li><strong>Inlet Water Analysis:</strong> Our engineering desk will evaluate your hydraulic flow rate and raw water chemistry parameters.</li>
        <li><strong>P&ID & Mass Balance:</strong> We formulate a custom process design meeting CPCB / SPCB environmental discharge norms.</li>
        <li><strong>Techno-Commercial Proposal:</strong> A comprehensive proposal with equipment specifications and investment layout will be shared.</li>
      </ol>

      <p>If you have urgent water discharge or compliance deadlines, you can directly connect with our senior water engineering desk at <strong><a href="tel:+917739283565">+91 7739283565</a></strong>.</p>

      <p style="margin-top: 25px;">Warm regards,<br>
      <strong>Engineering & Sales Desk</strong><br>
      R P Global Projects
      </p>
    `
    );

    if (!isConfigured || !transporter) {
      console.log(`[Email Service (Dev)] Dispatched Client Receipt to ${lead.email} (Ref #RPG-${refCode})`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: lead.email,
        subject: `Quotation Request Confirmed (Ref #RPG-${refCode}) — R P Global Projects`,
        html,
      });
      return true;
    } catch (err: any) {
      console.error("[Email Service Error] Failed to send client receipt:", err.message);
      return false;
    }
  },

  /**
   * Alert HR desk when a candidate submits an application with CV
   */
  sendNewApplicationToHR: async (app: ApplicationData): Promise<boolean> => {
    const title = `New Candidate Application: ${app.jobTitle} - ${app.fullName}`;
    const cvHtml = app.resumeUrl
      ? `<p><a href="${app.resumeUrl}" class="cta-btn" target="_blank">📄 View Candidate Resume PDF</a></p>`
      : `<p style="color: #64748b; font-size: 12px;"><em>No resume uploaded.</em></p>`;

    const html = baseEmailShell(
      title,
      `
      <div style="margin-bottom: 15px;">
        <span class="badge" style="background: #fdf4ff; color: #a21caf;">Careers & Recruitment ATS</span>
        <h2 style="margin: 8px 0 0 0; color: #0A192F; font-size: 18px;">${app.fullName}</h2>
        <div style="color: #64748b; font-size: 13px; margin-top: 2px;">Applied for: <strong>${app.jobTitle}</strong></div>
      </div>

      <table class="table">
        <tr><td class="label">Candidate Name</td><td class="value">${app.fullName}</td></tr>
        <tr><td class="label">Email Address</td><td class="value"><a href="mailto:${app.email}">${app.email}</a></td></tr>
        <tr><td class="label">Phone</td><td class="value"><a href="tel:${app.phone}">${app.phone}</a></td></tr>
        <tr><td class="label">Current Employer</td><td class="value">${app.currentCompany || "Not specified"}</td></tr>
        <tr><td class="label">Experience</td><td class="value">${app.experienceYears || "Not specified"} Years</td></tr>
        <tr><td class="label">Current CTC</td><td class="value">${app.currentCtc || "Not disclosed"}</td></tr>
        <tr><td class="label">Expected CTC</td><td class="value">${app.expectedCtc || "Negotiable"}</td></tr>
        <tr><td class="label">Notice Period</td><td class="value">${app.noticePeriodDays || 30} Days</td></tr>
      </table>

      ${app.coverNote ? `<div style="margin: 15px 0;"><strong>Candidate Note:</strong><p style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 13px;">${app.coverNote}</p></div>` : ""}

      ${cvHtml}

      <p style="margin-top: 25px; font-size: 12px; color: #64748b;">
        Application ID: <code>${app._id}</code><br>
        Manage applicants in the <a href="http://localhost:3000/admin/jobs">Admin ATS Pipeline</a>.
      </p>
    `
    );

    if (!isConfigured || !transporter) {
      console.log(`[Email Service (Dev)] Dispatched HR Candidate Alert for [${app.fullName}] applied to [${app.jobTitle}]`);
      console.log(`  CV URL: ${app.resumeUrl || "None"}`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: ADMIN_EMAIL,
        subject: `[Job Application] ${app.jobTitle}: ${app.fullName} (${app.experienceYears || "Fresh"} Yrs)`,
        html,
      });
      return true;
    } catch (err: any) {
      console.error("[Email Service Error] Failed to send HR applicant alert:", err.message);
      return false;
    }
  },

  /**
   * Send confirmation receipt to the job applicant
   */
  sendApplicationConfirmationToCandidate: async (app: ApplicationData): Promise<boolean> => {
    const title = `Application Received: ${app.jobTitle} — R P Global Projects`;

    const html = baseEmailShell(
      title,
      `
      <div style="margin-bottom: 15px;">
        <span class="badge" style="background: #ecfdf5; color: #047857;">Application Received</span>
        <h2 style="margin: 8px 0 0 0; color: #0A192F; font-size: 18px;">Hello ${app.fullName},</h2>
      </div>
      <p>Thank you for your interest in building an engineering career with <strong>R P Global Projects</strong>.</p>
      <p>We have successfully received your application for the <strong>${app.jobTitle}</strong> position.</p>

      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px;">
        <strong>Application Status:</strong> Under Review by Technical Recruitment Desk<br>
        <strong>Position:</strong> ${app.jobTitle}<br>
        <strong>Candidate Name:</strong> ${app.fullName}
      </div>

      <p>Our talent acquisition team carefully reviews every profile against plant engineering, project commissioning, and field execution requirements. If your background aligns with our immediate site projects, we will reach out to schedule an initial interview.</p>

      <p style="margin-top: 25px;">Best wishes,<br>
      <strong>Human Resources & Talent Acquisition</strong><br>
      R P Global Projects
      </p>
    `
    );

    if (!isConfigured || !transporter) {
      console.log(`[Email Service (Dev)] Dispatched Candidate Acknowledgement to ${app.email}`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: app.email,
        subject: `Application Received: ${app.jobTitle} — R P Global Projects`,
        html,
      });
      return true;
    } catch (err: any) {
      console.error("[Email Service Error] Failed to send candidate confirmation:", err.message);
      return false;
    }
  },

  /**
   * 5. Administrative Password Reset Request
   */
  sendPasswordResetEmail: async (
    email: string,
    resetUrl: string,
    name: string
  ): Promise<boolean> => {
    const title = "Password Reset Request — R P Global Projects Administration";

    const html = baseEmailShell(
      title,
      `
      <div style="margin-bottom: 15px;">
        <span class="badge" style="background: #eff6ff; color: #1d4ed8;">Security Alert</span>
        <h2 style="margin: 8px 0 0 0; color: #0A192F; font-size: 18px;">Hello ${name},</h2>
      </div>
      <p>A password reset request was initiated for your administrator account on the <strong>R P Global Projects Operations Portal</strong>.</p>
      <p>Click the button below to establish a new password for your account. This link will automatically expire in <strong>60 minutes</strong>.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #0077B6; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
          Reset Admin Password
        </a>
      </div>

      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 12px; color: #64748b; word-break: break-all;">
        <strong>Direct Link:</strong><br>
        <a href="${resetUrl}" style="color: #0077B6;">${resetUrl}</a>
      </div>

      <p style="font-size: 12px; color: #64748b;">If you did not request a password reset, please disregard this message or alert the security team immediately. Your password remains unchanged.</p>

      <p style="margin-top: 25px;">Regards,<br>
      <strong>Infrastructure & Security Desk</strong><br>
      R P Global Projects
      </p>
    `
    );

    if (!isConfigured || !transporter) {
      console.log(`[Email Service (Dev)] Dispatched Password Reset Email to ${email} with URL: ${resetUrl}`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: email,
        subject: `Password Reset Request — R P Global Projects`,
        html,
      });
      return true;
    } catch (err: any) {
      console.error("[Email Service Error] Failed to send password reset email:", err.message);
      return false;
    }
  },
};


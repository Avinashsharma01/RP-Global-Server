"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateController_1 = require("../controllers/certificateController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
// Public: View all active certificates
router.get("/", certificateController_1.getCertificates);
router.get("/:id", certificateController_1.getCertificateById);
// Admin: Upload and manage certificates
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), upload_1.uploadCertificateFile, certificateController_1.createCertificate);
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), upload_1.uploadCertificateFile, certificateController_1.updateCertificate);
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN"), certificateController_1.deleteCertificate);
exports.default = router;
//# sourceMappingURL=certificateRoutes.js.map
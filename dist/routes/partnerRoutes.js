"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partnerController_1 = require("../controllers/partnerController");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
// Public route: Landing page active partners
router.get("/", partnerController_1.getPartners);
// Admin route: Get all partners (including inactive)
router.get("/all", partnerController_1.getAllPartners);
// Get single partner
router.get("/:id", partnerController_1.getPartnerById);
// Admin route: Create partner with logo upload
router.post("/", upload_1.uploadPartnerLogo, partnerController_1.createPartner);
// Admin route: Update partner
router.put("/:id", upload_1.uploadPartnerLogo, partnerController_1.updatePartner);
// Admin route: Toggle active status
router.patch("/:id/toggle", partnerController_1.togglePartnerStatus);
// Admin route: Delete partner
router.delete("/:id", partnerController_1.deletePartner);
exports.default = router;
//# sourceMappingURL=partnerRoutes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const galleryController_1 = require("../controllers/galleryController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
// Public gallery view
router.get("/", galleryController_1.getGallery);
// Admin-only management
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), upload_1.uploadProjectImage, galleryController_1.createGalleryItem);
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), upload_1.uploadProjectImage, galleryController_1.updateGalleryItem);
// Upload multiple images to a specific project
router.post("/:id/images", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), upload_1.uploadProjectGalleryImages, galleryController_1.uploadProjectImages);
// Delete an image from a project's gallery
router.delete("/:id/images", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), galleryController_1.deleteProjectImage);
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN"), galleryController_1.deleteGalleryItem);
exports.default = router;
//# sourceMappingURL=galleryRoutes.js.map
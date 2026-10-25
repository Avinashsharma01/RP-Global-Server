"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public routes
router.get("/", productController_1.getProducts);
router.get("/:slug", productController_1.getProductBySlug);
// Admin-only management routes
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), productController_1.createProduct);
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), productController_1.updateProduct);
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN"), productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map
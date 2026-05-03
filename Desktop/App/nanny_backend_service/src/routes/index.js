const express = require("express");
const authMiddleware = require("../core/middleware/auth.middleware");
const roleMiddleware = require("../core/middleware/role.middleware");
const roles = require("../core/constants/roles.constant");
const authRoutes = require("../modules/auth/auth.routes");
const nannyRoutes = require("../modules/nanny/nanny.routes");
const userRoutes = require("../modules/user/user.routes");
const profileRoutes = require("../modules/parent/parent.routes");
const babyRoutes = require("../modules/baby/baby.routes");

const router = express.Router();

router.use("/auth", authRoutes);

// User-facing: ownership enforced inside service via token user_id
router.use("/profile", authMiddleware, profileRoutes);
router.use("/babies", authMiddleware, babyRoutes);

// Admin-only routes
router.use("/admin/users", authMiddleware, roleMiddleware(roles.ADMIN), userRoutes);
router.use("/admin/nannies", authMiddleware, roleMiddleware(roles.ADMIN), nannyRoutes);

module.exports = router;

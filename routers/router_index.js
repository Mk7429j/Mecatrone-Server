import { Router } from "express";
import { admin_routers, auth_routes, img_router, blogs_router, client_router, review_router, project_router, works_router, banner_router, dash_router, news_router, enquiry_router, voucher_router } from "./routers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const router = Router();

router.use("/auth", auth_routes);
router.use("/img", VerifyToken, img_router);
router.use("/admin", VerifyToken, admin_routers);
router.use("/dash", VerifyToken, dash_router);
router.use("/news", news_router);
router.use("/blogs", blogs_router);
router.use("/clients", client_router);
router.use("/review", review_router);
router.use("/project", project_router);
router.use("/work", works_router);
router.use("/banner", banner_router);
router.use("/enquiry", enquiry_router);
router.use("/voucher", VerifyToken, voucher_router);

export default router;

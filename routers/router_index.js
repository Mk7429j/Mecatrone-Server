import { Router } from "express";
import { admin_routers, auth_routes, img_router, blogs_router, client_router, review_router, project_router, works_router, banner_router, dash_router, news_router } from "./routers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const router = Router();

router.use("/auth", auth_routes);
router.use("/img", VerifyToken, img_router);
router.use("/admin", admin_routers);
router.use("/dash", VerifyToken, dash_router);
router.use("/news", news_router);
router.use("/blogs", VerifyToken, blogs_router);
router.use("/clients", VerifyToken, client_router);
router.use("/review", review_router);
router.use("/project", VerifyToken, project_router);
router.use("/work", works_router);
router.use("/banner", banner_router);

export default router;

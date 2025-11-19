import express from 'express';
import UrlController from '../controllers/urlController.js'
import { authenticateToken, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", optionalAuth, UrlController.createShortUrl);

router.get("/", authenticateToken, UrlController.getUserUrls);
router.get("/:id/analytics", authenticateToken, UrlController.getUrlAnalytics);
router.put("/:id", authenticateToken, UrlController.updateUrl);
router.delete("/:id", authenticateToken, UrlController.deleteUrl);

export default router;
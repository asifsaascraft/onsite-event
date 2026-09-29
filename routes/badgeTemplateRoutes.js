import express from "express";
import {
  getBadgeTemplate,
  saveBadgeTemplate,
} from "../controllers/badgeTemplateController.js";
import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";

const router = express.Router();

router.get(
  "/events/:eventId/badge-template",
  protect,
  authorizeEvent,
  getBadgeTemplate,
);

router.put(
  "/events/:eventId/badge-template",
  protect,
  authorizeEvent,
  saveBadgeTemplate,
);

export default router;

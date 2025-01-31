import { Router } from "express";
import subscriptionController from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", subscriptionController.list);
router.post("/subscribe", authMiddleware, subscriptionController.subscribe);

export default router;

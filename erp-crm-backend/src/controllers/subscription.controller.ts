import { Request, Response } from "express";
import subscriptionService from "../services/subscription.service";

class SubscriptionController {
  /**
   * @swagger
   * /api/subscriptions:
   *   get:
   *     tags:
   *       - Subscriptions
   *     summary: Get all subscription plans
   *     description: Retrieve a list of all available subscription plans.
   *     security: []
   *     responses:
   *       200:
   *         description: List of subscription plans retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 results:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       name:
   *                         type: string
   *                       price:
   *                         type: number
   *                         format: float
   *                       duration:
   *                         type: string
   *       500:
   *         description: Internal server error
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const plans = await subscriptionService.list();
      res.status(200).json({
        success: true,
        message: "Subscription plans retrieved successfully",
        results: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/subscriptions/subscribe:
   *   post:
   *     tags:
   *       - Subscriptions
   *     summary: Subscribe to a subscription plan
   *     description: Allows a logged-in user to subscribe to a subscription plan.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               planId:
   *                 type: integer
   *                 description: The ID of the subscription plan to subscribe to.
   *     responses:
   *       200:
   *         description: Subscription successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 results:
   *                   type: object
   *       400:
   *         description: Bad request, user ID not found or invalid plan
   *       500:
   *         description: Internal server error
   */
  async subscribe(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // ID del usuario logueado
      const { planId } = req.body;

      if (!userId) {
        throw new Error("User ID not found in request");
      }

      const subscription = await subscriptionService.subscribe(userId, planId);
      res.status(200).json({
        success: true,
        message: "Subscription successful",
        results: subscription,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }
}

export default new SubscriptionController();

import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Register a new user
   *     description: Registers a new user with the provided details.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email of the user.
   *               password:
   *                 type: string
   *                 description: The password for the user account.
   *               firstname:
   *                 type: string
   *                 description: The first name of the user.
   *               lastname:
   *                 type: string
   *                 description: The last name of the user.
   *               role:
   *                 type: string
   *                 description: The role of the user (e.g., admin, user).
   *               birthdate:
   *                 type: string
   *                 format: date
   *                 description: The birthdate of the user (optional).
   *     responses:
   *       201:
   *         description: User registered successfully
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
   *                   properties:
   *                     id:
   *                       type: integer
   *                     email:
   *                       type: string
   *       400:
   *         description: Invalid input or missing data
   *       500:
   *         description: Internal server error
   */

  async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        firstname,
        lastname,
        role,
        birthdate,
      } = req.body;

      const user = await authService.register(
        email,
        password,
        firstname,
        lastname,
        role,
        birthdate ? new Date(birthdate) : null
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        results: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Log in a user
   *     description: Authenticates a user and provides JWT tokens for session management.
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email of the user.
   *               password:
   *                 type: string
   *                 description: The password of the user.
   *               rememberMe:
   *                 type: boolean
   *                 description: Whether to remember the user (optional).
   *     responses:
   *       200:
   *         description: Login successful, JWT tokens returned in headers
   *         headers:
   *            x-auth-token:
   *                schema:
   *                    type: string
   *                description: The access token for the user session
   *            x-refresh-token:
   *                schema:
   *                    type: string
   *                description: The refresh token for the user session
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
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Internal server error
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, rememberMe = false } = req.body;

      // Llamar al servicio de login
      const tokens = await authService.login(email, password, rememberMe);

      // Establecer los tokens en los headers de la respuesta
      res.setHeader("x-auth-token", tokens.accessToken);
      res.setHeader("x-refresh-token", tokens.refreshToken);

      // Responder con éxito
      res.status(200).json({
        success: true,
        message: "Login successful",
        results: null,
      });
    } catch (error) {
      // Manejar errores
      res.status(401).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Log out a user
   *     description: Ends the user's session by invalidating the refresh token.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *     responses:
   *       200:
   *         description: User logged out successfully
   *       400:
   *         description: Invalid refresh token
   *       500:
   *         description: Internal server error
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Llamar al servicio de logout
      const result = await authService.logout(req.user);

      // Responder con éxito
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
        results: result,
      });
    } catch (error) {
      // Manejar errores
      res.status(400).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }
}

export default new AuthController();

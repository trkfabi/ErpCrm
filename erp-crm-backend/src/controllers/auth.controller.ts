import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, rememberMe } = req.body;

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

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body; // Asumimos que el refresh token llega en el cuerpo de la solicitud

      // Llamar al servicio de logout
      const result = await authService.logout(refreshToken);

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

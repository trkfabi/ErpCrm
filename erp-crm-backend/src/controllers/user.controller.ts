import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        role,
        firstName,
        lastName,
        birthDate,
      } = req.body;

      const user = await userService.createUser(
        email,
        password,
        role,
        firstName,
        lastName,
        birthDate
      );

      res.status(201).json({
        success: true,
        message: "User created successfully",
        results: user,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the user",
        results: null,
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page, limit, sortby, sortorder, filter } = req.query;
      const result = await userService.listUsers(
        page as string | undefined,
        limit as string | undefined,
        sortby as string | undefined,
        sortorder as string | undefined,
        filter as string | undefined
      );

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        results: result,
      });
    } catch (error) {
      console.error("Error in fetching users:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching users",
        results: null,
      });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, password, role, firstName, lastName, birthDate } = req.body;
    try {
      const user = await userService.updateUser(
        id,
        email,
        password,
        role,
        firstName,
        lastName,
        birthDate
      );
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await userService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        results: null,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      // El usuario logueado ya está disponible en req.user gracias al middleware de autenticación
      const user = req.user;

      // Devolver los datos del usuario logueado
      res.status(200).json({
        success: true,
        message: "User data retrieved successfully",
        results: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user data",
        results: null,
      });
    }
  }
}

export default new UserController();

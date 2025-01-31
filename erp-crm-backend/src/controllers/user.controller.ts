import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
  /**
   * @swagger
   * /api/users:
   *   post:
   *     tags:
   *       - Users
   *     summary: Create a new user
   *     description: Creates a new user with the provided information.
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
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               role:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               birthDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: User created successfully
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
   *       500:
   *         description: Internal server error
   */
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

      const user = await userService.create(
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

  /**
   * @swagger
   * /api/users:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get a list of users
   *     description: Retrieve a list of users with optional filters and pagination.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *       - in: query
   *         name: page
   *         description: Page number for pagination
   *         required: false
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         description: Number of users to retrieve per page
   *         required: false
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: filters
   *         description: JSON string of filters to apply on the users list
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of users retrieved successfully
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
   *                     users:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                           email:
   *                             type: string
   *                           firstName:
   *                             type: string
   *                           lastName:
   *                             type: string
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       500:
   *         description: Internal server error
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { skip, limit, page, sortby, sortorder } = req.pagination!;
      const filtersParm: Record<string, any>[] = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : undefined;

      const { users, total } = await userService.list(
        skip,
        limit,
        sortby,
        sortorder,
        filtersParm
      );

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        results: {
          users,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching users",
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update an existing user
   *     description: Update the user with the specified ID using the provided information.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               role:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               birthDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: User updated successfully
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
   *         description: Bad request, invalid input
   *       500:
   *         description: Internal server error
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, password, role, firstName, lastName, birthDate } = req.body;
    try {
      const user = await userService.update(
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

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Delete a user
   *     description: Delete the user with the specified ID.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to delete
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: Bad request, user not found
   *       500:
   *         description: Internal server error
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await userService.delete(id);
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

  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get the logged-in user's data
   *     description: Retrieve the data of the logged-in user.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *     responses:
   *       200:
   *         description: Successfully retrieved user data
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
   *       500:
   *         description: Internal server error
   */
  async me(req: Request, res: Response): Promise<void> {
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

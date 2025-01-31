import { Request, Response } from "express";
import organizationService from "../services/organization.service";

class OrganizationController {
  /**
   * @swagger
   * /api/organizations:
   *   post:
   *     tags:
   *       - Organizations
   *     summary: Create a new organization
   *     description: Create a new organization associated with the authenticated user.
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
   *               name:
   *                 type: string
   *                 description: The name of the organization.
   *     responses:
   *       201:
   *         description: Organization created successfully
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
   *                     name:
   *                       type: string
   *       401:
   *         description: User not authenticated
   *       500:
   *         description: Internal server error
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const ownerId = req.user?.id;

      if (!ownerId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          results: null,
        });
        return;
      }

      const organization = await organizationService.create(name, ownerId);

      res.status(201).json({
        success: true,
        message: "Organization created successfully",
        results: organization,
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
   * /api/organizations/{id}:
   *   get:
   *     tags:
   *       - Organizations
   *     summary: Get an organization by ID
   *     description: Retrieve the details of a specific organization by its ID.
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
   *         description: The ID of the organization to retrieve.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Organization retrieved successfully
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
   *                     name:
   *                       type: string
   *       404:
   *         description: Organization not found
   *       500:
   *         description: Internal server error
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const organization = await organizationService.getById(parseInt(id));

      res.status(200).json({
        success: true,
        message: "Organization retrieved successfully",
        results: organization,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/organizations:
   *   get:
   *     tags:
   *       - Organizations
   *     summary: Get a list of organizations
   *     description: Retrieve a paginated list of all organizations.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *       - in: query
   *         name: skip
   *         description: Number of records to skip (for pagination).
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         description: Number of records per page (for pagination).
   *         schema:
   *           type: integer
   *       - in: query
   *         name: sortby
   *         description: Sort field name.
   *         schema:
   *           type: string
   *       - in: query
   *         name: sortorder
   *         description: Sort order (asc/desc).
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of organizations retrieved successfully
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
   *                     organizations:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                           name:
   *                             type: string
   *       500:
   *         description: Internal server error
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      let { skip, limit, page, sortby, sortorder } = req.pagination!;
      const filtersParm: Record<string, any>[] = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : undefined;

      const { organizations, total } = await organizationService.list(
        skip,
        limit,
        sortby,
        sortorder,
        filtersParm
      );

      res.status(200).json({
        success: true,
        message: "Organizations retrieved successfully",
        results: {
          organizations,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching organizations",
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/organizations/user:
   *   get:
   *     tags:
   *       - Organizations
   *     summary: Get organizations by user
   *     description: Retrieve a paginated list of organizations associated with the logged-in user.
   *     parameters:
   *       - in: header
   *         name: x-refresh-token
   *         required: true
   *         schema:
   *           type: string
   *           description: Refresh token for session renewal.
   *     responses:
   *       200:
   *         description: List of organizations retrieved successfully
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
   *                     organizations:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                           name:
   *                             type: string
   *       500:
   *         description: Internal server error
   */
  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.user;
      let { skip, limit, page, sortby, sortorder } = req.pagination!;
      const filtersParm: Record<string, any>[] = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : undefined;

      const {
        organizations,
        total,
      } = await organizationService.getOrganizationsByUser(
        userId,
        skip,
        limit,
        sortby,
        sortorder,
        filtersParm
      );

      res.status(200).json({
        success: true,
        message: "Organizations retrieved successfully",
        results: {
          organizations,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching organizations",
        results: null,
      });
    }
  }

  /**
   * @swagger
   * /api/organizations/{id}:
   *   put:
   *     tags:
   *       - Organizations
   *     summary: Update an organization
   *     description: Update the details of an existing organization.
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
   *         description: The ID of the organization to update.
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The updated name of the organization.
   *     responses:
   *       200:
   *         description: Organization updated successfully
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
   *                     name:
   *                       type: string
   *       500:
   *         description: Internal server error
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedOrganization = await organizationService.update(
        parseInt(id),
        { name }
      );

      res.status(200).json({
        success: true,
        message: "Organization updated successfully",
        results: updatedOrganization,
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
   * /api/organizations/{id}:
   *   delete:
   *     tags:
   *       - Organizations
   *     summary: Delete an organization
   *     description: Delete an existing organization by its ID.
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
   *         description: The ID of the organization to delete.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Organization deleted successfully
   *       500:
   *         description: Internal server error
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await organizationService.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: "Organization deleted successfully",
        results: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  }
}

export default new OrganizationController();

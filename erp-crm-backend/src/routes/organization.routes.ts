import { Router } from "express";
import organizationController from "../controllers/organization.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { subscriptionMiddleware } from "../middlewares/subscription.middleware";
import { paginationMiddleware } from "../middlewares/pagination.middleware";

const router = Router();

/*
el campo features de la suscripción es un array de strings que puede contener estas características habilitadas para el plan de suscripción
{
  "maxOrganizations": 1,
  "maxEmployees": 5,
  "canGenerateInvoices": true,
  "supportPriority": "basic",
  "features": ["analytics", "emailSupport"]
}
*/
/**
 * Crear una organización
 * POST /api/organizations
 */
router.post(
  "/",
  authMiddleware, // Requiere autenticación
  subscriptionMiddleware("createOrganization"), // Verifica que la característica está habilitada
  organizationController.create
);

/**
 * Obtener una organización por su ID
 * GET /api/organizations/:id
 */
router.get(
  "/:id",
  authMiddleware, // Requiere autenticación
  organizationController.getById
);

/**
 * Obtener las organizaciones
 * GET /api/organizations
 */
router.get(
  "/",
  authMiddleware, // Requiere autenticación
  paginationMiddleware(10, 50), // Middleware de paginación
  organizationController.list
);

/**
 * Obtener las organizaciones asociadas al usuario autenticado
 * GET /api/organizations
 */
router.get(
  "/me",
  authMiddleware, // Requiere autenticación
  paginationMiddleware(10, 50), // Middleware de paginación
  organizationController.getByUser
);

/**
 * Actualizar una organización
 * PATCH /api/organizations/:id
 */
router.patch(
  "/:id",
  authMiddleware, // Requiere autenticación
  organizationController.update
);

/**
 * Eliminar una organización
 * DELETE /api/organizations/:id
 */
router.delete(
  "/:id",
  authMiddleware, // Requiere autenticación
  organizationController.delete
);

export default router;

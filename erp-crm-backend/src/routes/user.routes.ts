import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { paginationMiddleware } from "../middlewares/pagination.middleware";

const router = Router();

// Protegemos las rutas con el middleware de autenticación
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.create
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  paginationMiddleware(10, 50),
  userController.list
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.update
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.delete
);
// Ruta para obtener los datos del usuario logueado
router.get("/me", authMiddleware, userController.me);

export default router;

import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Protegemos las rutas con el middleware de autenticación
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.create
);
router.get(
  "/list",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.list
);
router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.update
);
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.delete
);
// Ruta para obtener los datos del usuario logueado
router.get("/me", authMiddleware, userController.getMe);

export default router;

import { Request, Response, NextFunction } from "express";
import prisma from "../config/database"; // Asegúrate de que la ruta a prisma sea correcta

export const roleMiddleware = (
  role: string // El rol que se quiere verificar
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          results: null,
        });
      }

      // Buscar el rol del usuario en la base de datos
      const userRole = await prisma.role.findUnique({
        where: {
          id: req.user.roleId,
        },
      });

      if (!userRole) {
        res.status(403).json({
          success: false,
          message: "Role not found",
          results: null,
        });
      }

      // Verificar si el usuario tiene el rol adecuado
      if (userRole.name !== role) {
        res.status(403).json({
          success: false,
          message: "Permission denied",
          results: null,
        });
      }

      // Si todo está bien, continuar con la solicitud
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        results: null,
      });
    }
  };
};

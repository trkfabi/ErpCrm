import { Request, Response, NextFunction } from "express";
import prisma from "../config/database"; // Asegúrate de que la ruta a prisma sea correcta

export const subscriptionMiddleware = (
  feature: string // La característica que se quiere verificar
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
        return;
      }

      // Buscar la suscripción del usuario en la base de datos
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { subscriptionPlan: true },
      });

      if (!user || !user.subscriptionPlan) {
        res.status(403).json({
          success: false,
          message: "No subscription plan found for this user",
          results: null,
        });
        return;
      }

      // Verificar si la característica está habilitada en el plan de suscripción
      const features = user.subscriptionPlan.features as Record<string, any>;

      if (!features || !features[feature]) {
        res.status(403).json({
          success: false,
          message: `Access denied: Feature "${feature}" not available for your subscription plan`,
          results: null,
        });
        return;
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

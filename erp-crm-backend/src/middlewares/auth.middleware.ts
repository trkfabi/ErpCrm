import { Request, Response, NextFunction } from "express";
//import "../types/express"; // Import the extended Request interface (should be imported globally)
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const accessToken = req.headers["x-auth-token"] as string;
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!accessToken) {
    res.status(401).json({
      success: false,
      message: "Access token is required",
      results: null,
    });
  }

  try {
    // Verificar el access token
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as any;
    req.user = decodedAccessToken;
    return next();
  } catch (error) {
    // Si el access token ha expirado, intentar refrescarlo usando el refresh token
    if ((error as Error).name === "TokenExpiredError" && refreshToken) {
      try {
        // Verificar el refresh token
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET!
        ) as any;

        // Generar un nuevo access token
        const newAccessToken = jwt.sign(
          {
            userId: decodedRefreshToken.userId,
            role: decodedRefreshToken.role,
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: "48h" }
        );

        // Establecer el nuevo access token en los headers
        res.setHeader("x-auth-token", newAccessToken);

        // Añadir la información del usuario al request
        req.user = decodedRefreshToken;

        return next();
      } catch (refreshError) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token or session expired",
          results: null,
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
        results: null,
      });
    }
  }
};

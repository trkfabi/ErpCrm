import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  let accessToken = req.headers.authorization as string;
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!accessToken) {
    res.status(401).json({
      success: false,
      message:
        "Access token is required. Please use `Authorization: Bearer XXXXX` header",
      results: null,
    });
    return;
  }

  console.log(accessToken);
  try {
    accessToken = accessToken.split(" ")[1]; // separar Bearer y Token

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
        console.log(req.user);
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

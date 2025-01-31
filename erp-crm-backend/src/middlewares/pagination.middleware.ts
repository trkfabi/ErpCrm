import { Request, Response, NextFunction } from "express";

export const paginationMiddleware = (
  defaultLimit: number = 10,
  maxLimit: number = 50
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(
        parseInt(req.query.limit as string) || defaultLimit,
        maxLimit
      );
      const skip = (page - 1) * limit;

      // Procesar ordenamiento
      const sortby = req.query.sortby as string | undefined;
      const sortorder = req.query.sortorder as string | undefined;

      // Procesar filtros
      const filters = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : undefined;

      req.pagination = {
        page,
        limit,
        skip,
        sortby,
        sortorder: sortorder === "desc" ? "desc" : "asc", // Orden predeterminado: ascendente
        filters,
      };

      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
        results: null,
      });
    }
  };
};

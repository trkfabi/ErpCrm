import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      pagination?: {
        page: number;
        limit: number;
        skip: number;
        sortby?: string;
        sortorder: "asc" | "desc";
        filters?: Record<string, any>;
      };
    }
  }
}
export {};

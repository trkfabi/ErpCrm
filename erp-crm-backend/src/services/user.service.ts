import prisma from "../config/database";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";

class UserService {
  async createUser(
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
    birthDate: Date | null
  ) {
    try {
      const user = await UserModel.createUser(
        email,
        password,
        role,
        firstName,
        lastName,
        birthDate
      );
      return user;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async listUsers(
    page: string | undefined,
    limit: string | undefined,
    sortby: string | undefined,
    sortorder: string | undefined,
    filter: string | undefined
  ) {
    const where: Record<string, any> = {};

    if (filter) {
      const filters = JSON.parse(filter);

      filters.forEach(
        ({
          key,
          operator,
          value,
        }: {
          key: string;
          operator: string;
          value: any;
        }) => {
          if (operator === "like") {
            where[key] = { contains: value, mode: "insensitive" };
          } else if (operator === "=") {
            where[key] = value;
          }
        }
      );
    }

    const orderBy: Record<string, any> = {};
    if (sortby && sortorder) {
      orderBy[sortby] = sortorder;
    }

    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    const users = await UserModel.findMany({
      where,
      orderBy,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: { profile: true },
    });

    const totalUsers = await UserModel.count({ where });

    return {
      users,
      total: totalUsers,
      page: Number(page),
      totalPages: Math.ceil(totalUsers / limitNumber),
    };
  }

  async updateUser(
    id: string,
    email?: string,
    password?: string,
    role?: string,
    firstName?: string,
    lastName?: string,
    birthDate?: Date | null
  ) {
    return await UserModel.updateUser(
      id,
      email,
      password,
      role,
      firstName,
      lastName,
      birthDate
    );
  }

  async deleteUser(id: string) {
    return await UserModel.deleteUser(id);
  }
}
export default new UserService();

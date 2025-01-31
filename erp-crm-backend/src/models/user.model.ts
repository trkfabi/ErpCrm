import prisma from "../config/database"; // Prisma instance
import bcrypt from "bcryptjs";

class UserModel {
  async createUser(
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
    birthDate: Date | null
  ) {
    // Find the role by name
    const userRole = await prisma.role.findUnique({ where: { name: role } });
    if (!userRole) throw new Error(`Role '${role}' not found`);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthDate,
        roleId: userRole.id,
      },
    });

    return user;
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
    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    // Check if the role is provided, if so, find it
    let roleId = user.roleId;
    if (role) {
      const userRole = await prisma.role.findUnique({ where: { name: role } });
      if (!userRole) throw new Error(`Role '${role}' not found`);
      roleId = userRole.id;
    }

    // If a password is provided, hash it
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: email || user.email,
        password: hashedPassword,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        birthDate: birthDate || user.birthDate,
        roleId,
      },
    });

    return updatedUser;
  }

  async findUsers(
    skip: number,
    limit: number,
    sortby?: string,
    sortorder?: string,
    filters?: Record<string, any>[]
  ) {
    const where: Record<string, any> = {};

    if (filters) {
      filters.forEach(({ key, operator, value }) => {
        if (operator === "like") {
          where[key] = { contains: value, mode: "insensitive" };
        } else if (operator === "=") {
          where[key] = value;
        }
      });
    }

    const orderBy = sortby
      ? { [sortby]: sortorder === "desc" ? "desc" : "asc" }
      : undefined;

    return prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async countUsers(filters?: Record<string, any>[]) {
    const where: Record<string, any> = {};

    if (filters) {
      filters.forEach(({ key, operator, value }) => {
        if (operator === "like") {
          where[key] = { contains: value, mode: "insensitive" };
        } else if (operator === "=") {
          where[key] = value;
        }
      });
    }

    return prisma.user.count({ where });
  }

  async deleteUser(id: string) {
    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return true;
  }
}

export default new UserModel();

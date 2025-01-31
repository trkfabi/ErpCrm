import prisma from "../config/database";

class OrganizationModel {
  async create(name: string, ownerId: number) {
    return await prisma.organization.create({
      data: {
        name,
        ownerId,
      },
    });
  }

  async getById(id: number) {
    return await prisma.organization.findUnique({
      where: { id },
      include: { employees: true, owner: true },
    });
  }

  async list(
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

    return prisma.organization.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });
  }

  async count(filters?: Record<string, any>[]) {
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

    return prisma.organization.count({ where });
  }

  async findOrganizationsByUser(
    userId: number,
    skip: number,
    limit: number,
    sortby?: string,
    sortorder?: string,
    filters?: Record<string, any>[]
  ) {
    const where: Record<string, any> = { userId };

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

    return prisma.organization.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });
  }

  async countOrganizationsByUser(
    userId: number,
    filters?: Record<string, any>[]
  ) {
    const where: Record<string, any> = { userId };

    if (filters) {
      filters.forEach(({ key, operator, value }) => {
        if (operator === "like") {
          where[key] = { contains: value, mode: "insensitive" };
        } else if (operator === "=") {
          where[key] = value;
        }
      });
    }

    return prisma.organization.count({ where });
  }

  async update(id: number, data: { name?: string }) {
    return await prisma.organization.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.organization.delete({
      where: { id },
    });
  }
}

export default new OrganizationModel();

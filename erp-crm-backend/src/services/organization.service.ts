import OrganizationModel from "../models/organization.model";

class OrganizationService {
  async create(name: string, ownerId: number) {
    const organization = await OrganizationModel.create(name, ownerId);
    return organization;
  }

  async getById(id: number) {
    const organization = await OrganizationModel.getById(id);
    if (!organization) {
      throw new Error("Organization not found");
    }
    return organization;
  }

  async getOrganizationsByUser(
    userId: number,
    skip: number,
    limit: number,
    sortby?: string,
    sortorder?: string,
    filters?: Record<string, any>[]
  ): Promise<{ organizations: any[]; total: number }> {
    const organizations = await OrganizationModel.findOrganizationsByUser(
      userId,
      skip,
      limit,
      sortby,
      sortorder,
      filters
    );

    const total = await OrganizationModel.countOrganizationsByUser(
      userId,
      filters
    );

    return { organizations, total };
  }

  async list(
    skip: number,
    limit: number,
    sortby?: string,
    sortorder?: string,
    filters?: Record<string, any>[]
  ): Promise<{ organizations: any[]; total: number }> {
    const organizations = await OrganizationModel.list(
      skip,
      limit,
      sortby,
      sortorder,
      filters
    );

    const total = await OrganizationModel.count(filters);

    return { organizations, total };
  }

  async update(id: number, data: { name?: string }) {
    const organization = await OrganizationModel.update(id, data);
    return organization;
  }

  async delete(id: number) {
    await OrganizationModel.delete(id);
    return { success: true };
  }
}

export default new OrganizationService();

import UserModel from "../models/user.model";

class UserService {
  async create(
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

  async list(
    skip: number,
    limit: number,
    sortby?: string,
    sortorder?: string,
    filters?: Record<string, any>[]
  ): Promise<{ users: any[]; total: number }> {
    const users = await UserModel.findUsers(
      skip,
      limit,
      sortby,
      sortorder,
      filters
    );
    const total = await UserModel.countUsers(filters);

    return { users, total };
  }

  async update(
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

  async delete(id: string) {
    return await UserModel.deleteUser(id);
  }
}
export default new UserService();

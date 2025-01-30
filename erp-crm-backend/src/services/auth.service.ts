import AuthModel from "../models/auth.model"; // Importar AuthModel

class AuthService {
  async register(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: string,
    birthdate: Date | null
  ) {
    try {
      const user = await AuthModel.register(
        email,
        password,
        firstname,
        lastname,
        role,
        birthdate
      );
      return user;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async login(email: string, password: string, rememberMe: boolean) {
    try {
      // Llamar al modelo para realizar el login
      const tokens = await AuthModel.login(email, password, rememberMe);
      return tokens;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async logout(refreshToken: string) {
    try {
      // Llamar al modelo para realizar el logout (eliminar el refresh token)
      const result = await AuthModel.logout(refreshToken);
      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new AuthService();

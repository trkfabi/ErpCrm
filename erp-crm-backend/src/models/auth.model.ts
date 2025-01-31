import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Si usas JWT para los tokens
import prisma from "../config/database"; // Prisma instance
import UserModel from "./user.model"; // Importar el modelo de usuario

class AuthModel {
  async register(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: string,
    birthdate: Date | null
  ) {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new Error("User already exists");

    // Validar el rol
    const userRole = await prisma.role.findUnique({ where: { name: role } });
    if (!userRole) throw new Error(`Role '${role}' not found`);

    // Crear el usuario usando el UserModel
    return await UserModel.createUser(
      email,
      password,
      role,
      firstname,
      lastname,
      birthdate
    );
  }

  async login(email: string, password: string, rememberMe: boolean) {
    // Buscar al usuario por correo electrónico
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    // Generar el access token (si 'remember me' está activado, puedes generar uno con más tiempo de expiración)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!, // Asegúrate de que 'JWT_SECRET' esté en tu .env
      { expiresIn: rememberMe ? "7d" : "1h" } // 'remember me' extiende la expiración
    );

    // Generar el refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "30d" } // El refresh token suele durar más tiempo
    );

    // Almacenar el refresh token en la base de datos
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    // Eliminar el token de la base de datos
    await prisma.refreshToken.delete({
      where: { userId: userId },
    });

    return { success: true, message: "Logout successful", results: null };
  }
}

export default new AuthModel();

import { Express, Request, Response } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Definir las opciones de Swagger
const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ERP/CRM API",
      version: "1.0.0",
      description: "API documentation for the best ERP/CRM system",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Especifica que se usará un token JWT
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Aplica la seguridad a todos los endpoints
      },
    ],
  },
  apis: ["./src/controllers/*.ts", "./src/routes/*.ts"], // Ruta a los archivos de las rutas y controladores
};

// Crear el espec de Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

function swaggerDocs(app: Express, port: number) {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (_: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;

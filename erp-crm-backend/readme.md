# ERP/CRM Backend & Api

## Arquitectura:

- Node.js
- Express
- Typescript
- Postgres
- Prisma ORM
- SwaggerUI

## Ejecucion:

- npm run dev // ejecuta en http://localhost:3000/api
- npm run staging
- npm run production
  (Estos environments se definien en package.json y en los files .env. Por ahora solo tenemos `dev`)

## Recordatorio de cómo funciona:

- app.ts es el main file del servicio y quien levanta el servidor Express.
- app.ts asocia los paths en la url a los diferentes manejadores de rutas. Los manejadores de rutas estan en el folder /routes
  Ej: app.use("/api/auth", authRoutes);

- En las rutas, antes de llamar al controller, puede ser que llamemos a un /middleware. Este se puede encargar por ejemplo de validar
  los tokens, de refrescarlos, de recuperar el usuario que esta logeado para pasarselo al contoller, de agregar los campos necesarios
  para paginar el REQUEST, validar roles de usuario, etc.

- Un manejador de ruta define los diferentes endpoints restful que espera y asocia cada HTTP METHOD y PATH a una funcion de un /controller
  Ej: router.post("/login", authController.login); // el POST a /login lo atenderá el metodo login del controller

- El controller se encarga unicamente de temas de protocolo http. Procesa parametros, body, headers, etc y delega la logica de negocio a un /service y luego retorna
  la respuesta JSON.
  Ej: const tokens = await authService.login(email, password, rememberMe);

- El service se encarga de la logica de negocio y si debe acceder a la base de datos, en lo posible no lo hace directamente,
  sino que lo hace a través del /model
  Ej: const tokens = await AuthModel.login(email, password, rememberMe);

- El model se encarga unicamente de las interacciones con la base de datos, a traves de los metodos de acceso que proporciona Prisma.
  Realiza las operaciones CRUD en la base.

## Resumiendo:

- Route -> (MiddleWares) -> Controller -> Service -> Model.

La respuesta de la API siempre será un valor 200, 201, 400, 401, 403 o 500.
Y el esquema del JSON siempre es:
{
success: boolean,
message: string,
results: object,
}

## Folder Structure:

/src
|_ /config
|_ types
|_ express (Extension de tipos de Express)
database.ts
swagger.ts
|_ /controllers
|_ /middlewares
|_ /models
|_ /routes
|_ /services
app.ts
/prisma
.env
nodemon.json
package.json
tsconfig.ts

## Documentacion

Usamos SwaggerUI para generar la documentacion de la api, para esto hay que definir comentarios especificos en cada metodo del controller.
Controlar muy bien la indentación porque se basa en eso, si no aparece en la doc es porque está mal indentado.
La doc se genera sola cada vez que se inicia el server y se ve en https://localhost:3000/api
Algunas configuraciones globales de swagger estan en src/config/swagger.ts

## Problemas resueltos:

En los middlewares typescript no permite agregar campos al Request si no están definidos.
Por ejemplo `req.user = .....` no compila, por lo tanto hay que extender el tipo Request de Express.
Eso se hace global en src/config/types/express/index.d.ts (.d.ts significa `definicion de tipos`).
En el archivo tsconfig.json se define la ruta donde Express busca archivos de definicion de tipos: "typeRoots": ["./node_modules/@types", "src/config/types"]
y en el src/config/types/express/index.d.ts definimos, para agregarle al tipo Request el user y la pagination.

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

## Brainstorm del sistema:

- Roles de Usuario (user, admin, employee, etc)
- Usuarios con Rol
- Subscripciones (3 niveles,... con un json para definir la configuracion de cada nivel)
- Organizaciones. Un usuario puede definir una organizacion y crear usuarios que sean empleados de la misma ?

- Categorias o familia de productos
- Productos
- Pedidos
- Facturas

- Factura electronica friendly ... se podria customizar por pais.

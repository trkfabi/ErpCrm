import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// async function main() {
//     // Connect the client
//     await prisma.$connect();
//     console.log('Connected to the database');

//     // You can add your database queries here
// }

// main()
//     .catch(e => {
//         throw e;
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

export default prisma;

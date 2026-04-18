import { app } from "./lib/app.js";
import { prisma } from "./lib/prisma.js"

const PORT = process.env.PORT || 5000;


// ==================== IIFE Sunction to start the server ====================\\
(async () => {
    try {
        await prisma.$connect();
        console.log("Server is running....")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(`Error on starting server : ${error}`)
        await prisma.$disconnect();
        process.exit(1);
    }


})()



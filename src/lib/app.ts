import { toNodeHandler } from "better-auth/node";
import express from "express";
import type { Application, Request, Response } from "express";
import { auth } from "./auth";
import cors from "cors";

const app: Application = express();
app.use(cors({
    origin: 'http://localhost:3000', 
    // origin: "*",
    credentials: true,
}))

//  ==================== Routes For Better Auth ====================\\

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json()); // Middleware to parse JSON bodies





app.get("/", (req: Request, res: Response) => {
    res.send("Server  for Sakib is running....");
});








export { app };
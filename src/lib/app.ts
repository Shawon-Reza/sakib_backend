import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import express from "express";
import type { Application, Request, Response } from "express";
import { auth } from "./auth";
import cors from "cors";
import customerRoute from "../modules/customers/customer.router";
import { globalErrorHandler } from "../middleware/globalErrorHandler";
import invoiceRouter from "../modules/invoices/invoice.router";
import { requireAuth } from "../middleware/middleware";
import { Role } from "../../prisma/generated/prisma/enums";

const app: Application = express();
app.use(cors({
    origin: 'http://localhost:3000',
    // origin: "*",
    credentials: true,
}))

//  ==================== Routes For Better Auth ====================\\

app.get("/api/isme", async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            user: session.user,
            session: session.session,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get current user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json()); // Middleware to parse JSON bodies


// ====================== Routes Redirects ====================== \\ 
app.use("/api/customers", customerRoute);
app.use("/api/invoices", requireAuth(Role.ADMIN), invoiceRouter);





app.get("/", (req: Request, res: Response) => {
    res.send("Server  for Sakib is running....");
});


// ❗ MUST be last middleware
app.use(globalErrorHandler);





export { app };
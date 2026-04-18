import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { Role } from "../../prisma/generated/prisma/client";

type AppUser = {
    id: string;
    name: string;
    email: string;
    role?: Role;
    phone?: string | null;
};

export type AuthContext = {
    user: AppUser;
    session: unknown;
};

export type AuthRequest = Request & {
    auth?: AuthContext;
};

export const requireAuth = (...allowedRoles: Role[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            console.log(session)
            console.log(allowedRoles)


            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const user = session.user as AppUser;
            req.auth = {
                user,
                session: session.session,
            };

            if (allowedRoles.length > 0 && (!user.role || !allowedRoles.includes(user.role))) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: insufficient role",
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Authentication failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };
};

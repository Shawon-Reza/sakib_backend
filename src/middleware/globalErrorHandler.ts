import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../../prisma/generated/prisma/client";
// import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    console.error("🔥 FULL PRISMA ERROR:", err);

    // =====================================================
    // 🟡 1. PRISMA KNOWN REQUEST ERRORS (P2000 - P2029)
    // =====================================================
    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        const code = err.code;

        // 🔥 UNIQUE CONSTRAINT
        if (code === "P2002") {
            return res.status(400).json({
                success: false,
                type: code,
                message: "Duplicate value (already exists)",
                meta: err.meta,
            });
        }

        // 🔥 NOT FOUND
        if (code === "P2025" || code === "P2001") {
            return res.status(404).json({
                success: false,
                type: code,
                message: "Record not found",
                meta: err.meta,
            });
        }

        // 🔥 FOREIGN KEY / RELATION ERRORS
        if (code === "P2003" || code === "P2014" || code === "P2017") {
            return res.status(400).json({
                success: false,
                type: code,
                message: "Relation/foreign key constraint failed",
                meta: err.meta,
            });
        }

        // 🔥 VALIDATION / INPUT ERRORS
        if (
            [
                "P2000",
                "P2005",
                "P2006",
                "P2007",
                "P2008",
                "P2009",
                "P2012",
                "P2013",
                "P2019",
                "P2020"
            ].includes(code)
        ) {
            return res.status(400).json({
                success: false,
                type: code,
                message: "Invalid input data",
                meta: err.meta,
            });
        }

        // 🔥 DATABASE ISSUES
        if (
            [
                "P2021",
                "P2022",
                "P2023",
                "P2024",
                "P2037"
            ].includes(code)
        ) {
            return res.status(500).json({
                success: false,
                type: code,
                message: "Database issue (table/column/connection problem)",
                meta: err.meta,
            });
        }

        // 🔥 TRANSACTION / CONFLICT ERRORS
        if (
            [
                "P2034",
                "P2028",
                "P2027",
                "P2029"
            ].includes(code)
        ) {
            return res.status(500).json({
                success: false,
                type: code,
                message: "Transaction/DB conflict error",
                meta: err.meta,
            });
        }

        // 🔥 DEFAULT PRISMA KNOWN ERROR
        return res.status(400).json({
            success: false,
            type: code,
            message: err.message,
            meta: err.meta,
        });
    }

    // =====================================================
    // 🟠 2. PRISMA VALIDATION ERROR
    // =====================================================
    if (err instanceof Prisma.PrismaClientValidationError) {

        const message = err.message;

        // ============================
        // 1. FIELD EXTRACTION
        // ============================
        const fieldMatch =
            message.match(/Argument\s+`?(\w+)`?\s+is\s+missing/i) ||
            message.match(/Argument\s+`?(\w+)`?/i) ||
            message.match(/field\s+`?(\w+)`?/i);

        const field = fieldMatch?.[1] || "unknown_field";

        // ============================
        // 2. REASON EXTRACTION
        // ============================
        let reason = "unknown";

        if (/is missing/i.test(message)) {
            reason = "missing";
        } else if (/invalid/i.test(message)) {
            reason = "invalid";
        } else if (/expected/i.test(message)) {
            reason = "wrong_type";
        }
        const combinedMessage = `${field} is ${reason}`;
        return res.status(400).json({
            success: false,
            type: "PRISMA_VALIDATION_ERROR",
            field,
            reason,   // 🔥 THIS IS WHAT YOU WANTED
            message,
            combinedMessage,
        });
    }

    // =====================================================
    // 🔴 3. PRISMA INIT ERROR (DB CONNECTION / ENV)
    // Covers P1000 - P1017 + P3000 - P3024 (schema engine)
    // =====================================================
    if (err instanceof Prisma.PrismaClientInitializationError) {
        return res.status(500).json({
            success: false,
            type: err.errorCode || "PRISMA_INIT_ERROR",
            message: err.message,
        });
    }

    // =====================================================
    // ⚪ 4. PRISMA UNKNOWN ENGINE ERROR
    // Covers P6000 - P6010 (Accelerate, engine crash, etc.)
    // =====================================================
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return res.status(500).json({
            success: false,
            type: "PRISMA_UNKNOWN_ERROR",
            message: err.message,
        });
    }

    // =====================================================
    // 🔥 5. NON-PRISMA ERROR (FALLBACK)
    // =====================================================
    return res.status(500).json({
        success: false,
        type: "INTERNAL_SERVER_ERROR",
        message: err?.message || "Something went wrong",
    });
};// helper (VERY IMPORTANT)
function extractFromBackticks(text: string) {
    const match = text.match(/`([^`]+)`/);
    return match?.[1];
}
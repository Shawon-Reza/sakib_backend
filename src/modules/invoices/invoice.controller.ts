import type { NextFunction, Request, Response } from "express";
import { invoiceService } from "./invoice.service.js";



// ========================= Create Invoice ========================= \\
const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const result = await invoiceService.createInvoice(payload);

        return res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
}
//  ====================== Get All Invoices ====================== \\
const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const queries = req.query;
        const result = await invoiceService.getInvoices(queries as any);

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        next(error);
    }
}
// ========================= Get Invoice By ID ========================= \\
const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    //     if (!id) {
    //         return res.status(400).json({
    //             success: false,
    //             message: "Invoice ID is required",
    //         });
    //     }

    //     const result = await invoiceService.getInvoiceById(id);

    //     return res.status(200).json({
    //         success: true,
    //         data: result,
    //     });

    // } catch (error) {
    //     next(error);
    // }
}


export const invoiceController = {
    createInvoice,
    getInvoices,
    getInvoiceById,
}

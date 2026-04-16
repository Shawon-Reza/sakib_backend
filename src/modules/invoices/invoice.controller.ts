import type { NextFunction, Request, Response } from "express";



// ========================= Create Invoice ========================= \\
const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        next(error);
    }
}
//  ====================== Get All Invoices ====================== \\
const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        next(error);
    }
}
// ========================= Get Invoice By ID ========================= \\
const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        next(error);
    }
}


export const invoiceController = {
    createInvoice,
    getInvoices,
    getInvoiceById,
}

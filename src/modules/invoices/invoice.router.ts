import { Router } from "express";
import { invoiceController } from "./invoice.controller";

const invoiceRouter = Router();
invoiceRouter.post("/", invoiceController.createInvoice);
invoiceRouter.get("/", invoiceController.getInvoices);
invoiceRouter.get("/:id", invoiceController.getInvoiceById);

export default invoiceRouter;

import type { NextFunction, Request, Response } from "express";
import { customerService } from "./customer.service";


const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Customer data from controller:", req.body);
        const result = await customerService.createCustomer(req.body);

        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: result,
        });

    } catch (err) {
        next(err);
    }
}


//  ====================== Get All Customers ====================== \\
const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await customerService.getCustomers(req as any);








        
        return res.status(200).json({
            success: true,
            message: "Customers retrieved successfully",
            data: result,
        });

    } catch (err) {
        next(err);
    }
}



// ========================= Get Customer By ID ========================= \\

const getCustomersById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await customerService.getCustomersById(id as string);
        return res.status(200).json({
            success: true,
            message: "Customer retrieved successfully",
            data: result,
        });

    } catch (err) {
        next(err);
    }
}


export const customerController = {
    createCustomer,
    getCustomers,
    getCustomersById,
}
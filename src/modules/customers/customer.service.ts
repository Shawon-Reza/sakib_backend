import type { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createCustomer = async (customerData: Prisma.CustomerCreateInput) => {
    // Implementation for creating a customer
    try {
        console.log("Customer data From Service:", customerData);
        const response = await prisma.customer.create({
            data: customerData,
        })
        return response;



    } catch (error) {
        console.log(error)
        throw error
    }
};

const getCustomers = async (req: any) => {
    try {
        const { status, search, sort } = req.query;
        console.log(sort)
        let orderBy: any = undefined;

        const activeStatus =
            status === "true" ? true :
                status === "false" ? false :
                    undefined;

        const where: any = {};

        if (status !== undefined) {
            where.status = activeStatus;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
            ];
        }
        // ✅ Sorting (correct place)
        if (sort) {
            const [field, order] = sort.split(":");

            // optional safety
            const allowedFields = ["name", "email", "createdAt", "status"];
            const allowedOrder = ["asc", "desc"];

            if (allowedFields.includes(field) && allowedOrder.includes(order)) {
                orderBy = {
                    [field]: order,
                };
            }
        }

        const res = await prisma.customer.findMany({
            where,
            orderBy,
        });

        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getCustomersById = async (id: string) => {
    // Implementation for getting a customer by ID
    console.log("ID", id)
    try {
        const res = await prisma.customer.findUnique({
            where: {
                id: id,
            }
        })
        console.log(res)
        if (!res) {
            throw new Error("Customer not found");
        }
        return res;
    } catch (error) {
        console.log(error)
        throw error
    }
};

export const customerService = {
    createCustomer,
    getCustomers,
    getCustomersById,
};
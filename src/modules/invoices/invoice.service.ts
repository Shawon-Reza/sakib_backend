
import { prisma } from "../../lib/prisma.js";

const ALLOWED_STATUSES = ["PAID", "PARTIAL", "DUE"] as const;
type InvoiceStatus = (typeof ALLOWED_STATUSES)[number];

type InvoiceItemPayload = {
    itemName: string;
    quantity?: number | string;
    qty?: number | string;
    unit: string;
    rate: number | string;
    amount?: number | string;
};

// ========================= Create Invoice  ========================= \\
const createInvoice = async (payload: any) => {
    try {
        const customerData = payload?.customer;

        if (!customerData?.phone) {
            throw new Error("Customer phone is required");
        }

        if (!Array.isArray(payload?.items) || payload.items.length === 0) {
            throw new Error("At least one invoice item is required");
        }

        const normalizedItems = (payload.items as InvoiceItemPayload[]).map((item) => {
            const itemName = String(item.itemName ?? "").trim();
            const unit = String(item.unit ?? "").trim();
            const quantity = Number(item.quantity ?? item.qty);
            const rate = Number(item.rate);
            const rawAmount = item.amount;
            const amount = rawAmount === undefined || rawAmount === null || rawAmount === ""
                ? quantity * rate
                : Number(rawAmount);

            if (!itemName) {
                throw new Error("Item name is required");
            }

            if (!unit) {
                throw new Error("Item unit is required");
            }

            if (!Number.isFinite(quantity) || quantity <= 0) {
                throw new Error("Item quantity must be a valid number greater than 0");
            }

            if (!Number.isFinite(rate) || rate < 0) {
                throw new Error("Item rate must be a valid number");
            }

            if (!Number.isFinite(amount) || amount < 0) {
                throw new Error("Item amount must be a valid number");
            }

            return {
                itemName,
                unit,
                quantity,
                rate,
                amount,
            };
        });

        const inputStatus = String(payload.status ?? "DUE").toUpperCase();
        const status: InvoiceStatus = (ALLOWED_STATUSES as readonly string[]).includes(inputStatus)
            ? (inputStatus as InvoiceStatus)
            : "DUE";

        const totalAmount = Number(payload.totalAmount ?? 0);
        const receivedAmount = Number(payload.receivedAmount ?? 0);
        const dueAmount = Number(payload.dueAmount ?? Math.max(totalAmount - receivedAmount, 0));

        const createdInvoice = await prisma.$transaction(async (tx: any) => {
            // ================== Check if customer exists based on phone number, if not create a new customer ==================\\
            let customer = await tx.customer.findUnique({
                where: {
                    phone: customerData.phone,
                },
            });

            if (!customer) {
                customer = await tx.customer.create({
                    data: {
                        name: customerData.name,
                        email: customerData.email,
                        phone: customerData.phone,
                        address: customerData.address,
                        referrer: customerData.referrer,
                        shop_type: customerData.shop_type ?? "GENERAL",
                    },
                });
            }

            const invoiceCounter = await tx.invoice.count({
                where: {
                    customerId: customer.id,
                },
            });

            const cleanName = customer.name.replace(/\s+/g, "").slice(0, 5).toUpperCase();
            const last4Phone = customer.phone.slice(-4);
            const invoiceNo = String(invoiceCounter + 1).padStart(4, "0");
            const billNo = `INV-${invoiceNo}-${cleanName}-${last4Phone}`;

            return tx.invoice.create({
                data: {
                    billNo,
                    customerId: customer.id,

                    items: {
                        create: normalizedItems,
                    },
                    totalAmount: Number.isFinite(totalAmount) ? totalAmount : 0,
                    receivedAmount: Number.isFinite(receivedAmount) ? receivedAmount : 0,
                    dueAmount: Number.isFinite(dueAmount) ? dueAmount : 0,
                    status,
                },
                include: {
                    items: true,
                    customer: true,
                },
            });
        });

        return createdInvoice;

    } catch (error) {
        throw error;
    }
}
// ====================== Get All Invoices ====================== \\
const getInvoices = async (queries: any) => {
    try {
        console.log(queries)

        const where: any = {};
        if (queries.id) {
            console.log(queries.id)
            where.customerId = String(queries.id);
        }


        return await prisma.invoice.findMany({

            where,

            include: {
                customer: true,
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        throw error;
    }
}
// ========================= Get Invoice By ID ========================= \\
const getInvoiceById = async (id: string) => {
    // try {
    //     const invoice = await prisma.invoice.findUnique({
    //         where: { id },
    //         include: {
    //             customer: true,
    //             items: true,
    //         },
    //     });

    //     if (!invoice) {
    //         throw new Error("Invoice not found");
    //     }

    //     return invoice;
    // } catch (error) {
    //     throw error;
    // }
}

export const invoiceService = {
    createInvoice,
    getInvoices,
    getInvoiceById,
}
import { Router } from "express";
import { customerController } from "./customer.controller.js";

const customerRoute = Router();

customerRoute.post("/", customerController.createCustomer);
customerRoute.get("/", customerController.getCustomers);
customerRoute.get("/:id", customerController.getCustomersById);



export default customerRoute;


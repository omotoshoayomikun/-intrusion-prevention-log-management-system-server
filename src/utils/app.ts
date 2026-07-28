import express, { type Application } from 'express';
import cors from "cors"
import { Request, Response, NextFunction } from 'express';
import {env} from "../utils/env" ;
import customerRoutes from '../routes/customers/coustomer.routes';
import staffRoutes from '../routes/staffs/staff.routes';
import authRoutes from '../routes/auth/auth.routes';
import productRoutes from '../routes/products/products.routes';
import holidayRoutes from '../routes/holiday/holiday.routes';
import loanRoutes from '../routes/loan/loan.routes';

// import { notFound, errorHandler } from "../middleware/errors";


import cookieParser from "cookie-parser";
const app: Application = express();


app.use(cors({
    origin: [env.FRONTEND_URL],
    credentials: true
}
))

// Keep raw body for the webhook route only:
// app.use("/booking/webhook/paystack", express.raw({ type: "*/*" }));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/customer", customerRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Server Works");
})



interface ErrorWithStatus extends Error {
    status?: number;
}

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});


// app.use(notFound);
// app.use(errorHandler);


export default app;
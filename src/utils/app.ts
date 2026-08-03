import express, { type Application } from 'express';
import cors from "cors"
import { Request, Response, NextFunction } from 'express';
import { env } from "../utils/env";
import authRoutes from "../routes/auth/auth.routes"
import fileRoutes from "../routes/file/file.route"
import userRoutes from "../routes/user/user.route"

// import { notFound, errorHandler } from "../middleware/errors";


import cookieParser from "cookie-parser";
import requestLogger from '../middleware/Logger.middleware'
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

app.use(requestLogger);

//routes
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/customer", customerRoutes);
// app.use("/api/staffs", staffRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/holidays", holidayRoutes);
// app.use("/api/loans", loanRoutes);

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
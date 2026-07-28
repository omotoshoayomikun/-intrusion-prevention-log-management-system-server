import logger from "./config/loggerConfig";
import app from "./utils/app";
import dotenv from "dotenv";
import { env } from "./utils/env";
import { connectDB } from "./config/dbConnection";
dotenv.config();

const startServer = async() => {
    try {

       await connectDB();

        if(env.NODE_ENV !== "production") {
            await new Promise<void>((resolve) => {
                app.listen(env.PORT, () => {
                    logger.info(`Server is running on port ${env.PORT}`)
                    resolve();
                })
            });
        }

        logger.info("Server setup initiated.");
    } catch (error) {
        logger.error('Server failed to initialize:', error);
    }
}

startServer();

export default app;
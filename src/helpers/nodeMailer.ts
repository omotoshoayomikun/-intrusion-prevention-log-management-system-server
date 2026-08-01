import { createError } from "../config/createError";
import logger from "../config/loggerConfig";
import transporter from "../config/transporter";
import { IMailOPtion } from "../utils/types";

export const SendMessage = async (senderEmail: string, recieverEmail: string,  details: any, subject?: string) => {

    try {

        const mailOptions: IMailOPtion = {
            from: {
                name: "Networking service",
                address: senderEmail,
            },
            to: `${recieverEmail}`,
            subject: subject || `Networking service`,
            html: details,
        };

       await transporter.sendMail(mailOptions);
    
    } catch (error) {
        logger.error("Error occur when trying to send an email: ", error)
        throw createError(404, `Error occur when trying to send an email: ${error}`)
    }

}
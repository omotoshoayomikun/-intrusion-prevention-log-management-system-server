// src/helpers/verification.ts
import { EmailVerificationModel } from "../models/emailVerification.model";
import { SendMessage } from "../helpers/nodeMailer"; // your helper file
import { env } from "../utils/env";

export function generate4DigitCode() {
    return String(Math.floor(1000 + Math.random() * 9000)); // 1000–9999
}

export async function createAndSendVerificationCode(user: { _id: any; email: string; first_name?: string, lastname?: string, middle_name?: string }) {
    // Invalidate previous not-used codes (optional, keeps one active)
    await EmailVerificationModel.deleteMany({ userId: user._id, used: false });

    const code = generate4DigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await EmailVerificationModel.create({ userId: user._id, code, expiresAt });

   // The `details` object goes into your generateMsgHtml(details)
    // const details = {
    //     title: "Verify your email",
    //     code,
    //     expiresInMinutes: 10,
    //     userFirstName: user.name || "there",
    // };

    const generateMsgHtml = () => {
        return `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 12px">${`Verify your email`}</h2>
      <p>Hi ${user.lastname || "there"},</p>
      <p>Use the 4-digit code below to verify your email:</p>
      <div style="font-size:28px;letter-spacing:8px;font-weight:700;margin:16px 0">${code}</div>
      <p>This code expires in ${10} minutes.</p>
      <p style="color:#6b7280;font-size:12px">If you didn’t request this, you can ignore this email.</p>
    </div>
  `;
    }

 

    await SendMessage(env.TRANSPORTER_EMAIL, user.email, generateMsgHtml(), "Confirm your email");
}

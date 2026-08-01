// src/helpers/passwordReset.ts
import crypto from "crypto";
import { PasswordResetModel } from "../models/passwordReset.model";
import { SendMessage } from "../helpers/nodeMailer";
import { env } from "../utils/env";

export async function createAndSendPasswordReset(user: { _id: any; email: string; first_name?: string }) {
    // Invalidate previous unused tokens
    await PasswordResetModel.updateMany({ userId: user._id, used: false }, { $set: { used: true } });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    await PasswordResetModel.create({ userId: user._id, token, expiresAt });

    const resetUrl = `${env.FRONTEND_URL}/reset-password/${token}`;

    // const details = {
    //     title: "Reset your password",
    //     resetUrl,
    //     expiresInMinutes: 30,
    //     userFirstName: user.name || "there",
    // };

    const generateMsgHtml = () => {
        if (resetUrl) {
            return `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2>Reset your password</h2>
        <p>Hi ${user.first_name || "there"},</p>
        <p>Click the button below to reset your password. This link expires in ${30} minutes.</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#111827;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Reset password</a></p>
        <p>If the button doesn’t work, copy and paste this URL into your browser:<br/>${resetUrl}</p>
      </div>`;
        }
    }

    await SendMessage(env.TRANSPORTER_EMAIL, user.email, generateMsgHtml(), "Password reset request");
}

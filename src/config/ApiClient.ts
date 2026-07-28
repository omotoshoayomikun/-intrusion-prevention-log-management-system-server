import axios from "axios";

import { env } from "../utils/env";

export const ApiClient = axios.create({
    baseURL: env.PAYSTACK_HOSTNAME,
    timeout: 20000,
    headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
    }
})
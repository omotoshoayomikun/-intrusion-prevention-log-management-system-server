import { VPN_KEYWORDS, VpnResult } from "../utils/types";
import axios from "axios";
export const checkVpn = async (
  ip: string
): Promise<VpnResult> => {
  try {
    const { data } = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,isp,org`
    );

    const text = `${data.isp || ""} ${data.org || ""}`
      .toLowerCase();

    const isVpn = VPN_KEYWORDS.some((keyword) =>
      text.includes(keyword)
    );

    return {
      isVpn,
      isp: data.isp,
      organization: data.org,
    };
  } catch {
    return { isVpn: false };
  }
}
  import { getAuth } from "@clerk/express";

  export async function createContext({ req }: { req: any }) {
    const auth = getAuth(req);

    const forwardedFor = req.headers["x-forwarded-for"];
    const realIp = req.headers["x-real-ip"];

    const ipAddress =
      forwardedFor?.toString().split(",")[0] ||
      realIp?.toString() ||
      req.socket?.remoteAddress ||
      "unknown";

    return {
      userId: auth.userId,
      ipAddress,
    };
  }

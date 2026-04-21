const DEFAULT_PORT = 5000;
const DEFAULT_DB_NAME = "muen";
const DEFAULT_SESSION_SECRET = "dev-secret-change-me";

function readInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const serverEnv = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: readInt(process.env.PORT, DEFAULT_PORT),
  mongoUri: process.env.MONGODB_URI || "",
  mongoDbName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  sessionSecret: process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET,
  paypalMode: process.env.PAYPAL_MODE || "sandbox",
  paypalClientId: process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID || "",
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  zoomAccountId: process.env.ZOOM_ACCOUNT_ID || "",
  zoomClientId: process.env.ZOOM_CLIENT_ID || "",
  zoomClientSecret: process.env.ZOOM_CLIENT_SECRET || "",
};

export const isProduction = serverEnv.nodeEnv === "production";
export const isDevelopment = !isProduction;
export const hasMongoConfig = Boolean(serverEnv.mongoUri);
export const hasPaypalCredentials = Boolean(serverEnv.paypalClientId && serverEnv.paypalClientSecret);
export const hasZoomCredentials = Boolean(serverEnv.zoomAccountId && serverEnv.zoomClientId && serverEnv.zoomClientSecret);

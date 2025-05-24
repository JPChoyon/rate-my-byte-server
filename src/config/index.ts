import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

type ExpiryTime = `${number}${"s" | "m" | "h" | "d"}`;

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as ExpiryTime,

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as ExpiryTime,

  reset_secret_key: process.env.RESET_SECRET_KEY,
  reset_expires_in: process.env.RESET_EXPIRES_IN as ExpiryTime,

  cloudnary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudnary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudnary_api_secret: process.env.CLOUDINARY_API_SECRET,

  email: {
    sender: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASS,
  },

  website_url: process.env.WEBSITE_URL,

  sp_endpoint: process.env.SP_ENDPOINT,
  sp_username: process.env.SP_USERNAME,
  sp_password: process.env.SP_PASSWORD,
  sp_prefix: process.env.SP_PREFIX,
  sp_return_url: process.env.SP_RETURN_URL,
};

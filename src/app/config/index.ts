import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

class Config {
  constructor() {
    if (!process.env.PORT) {
      throw new Error("PORT is required in .env file");
    }
    if (!process.env.BCRYPT_SALT) {
      throw new Error("BCRYPT_SALT is required in .env file");
    }
    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV is required in .env file");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required in .env file");
    }
    if (!process.env.JWT_EXPIRES_IN) {
      throw new Error("JWT_EXPIRES_IN is required in .env file");
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is required in .env file");
    }
    if (!process.env.REFRESH_TOKEN_EXPIRES_IN) {
      throw new Error("REFRESH_TOKEN_EXPIRES_IN is required in .env file");
    }
    if (!process.env.RESET_PASS_TOKEN) {
      throw new Error("RESET_PASS_TOKEN is required in .env file");
    }
    if (!process.env.RESET_PASS_EXPIRES_IN) {
      throw new Error("RESET_PASS_EXPIRES_IN is required in .env file");
    }
    if (!process.env.RESET_PASS_LINK) {
      throw new Error("RESET_PASS_LINK is required in .env file");
    }
    if (!process.env.NODE_EMAIL) {
      throw new Error("NODE Email is required in .env file");
    }
    if (!process.env.NODE_EMAIL_PASS) {
      throw new Error("NODE Email pass is required in .env file");
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("CLOUDINARY_CLOUD_NAME is required in .env file");
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error("CLOUDINARY_API_KEY is required in .env file");
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("CLOUDINARY_API_SECRET is required in .env file");
    }
  }

  // Getters for environment variables
  public get port(): string {
    return String(process.env.PORT);
  }
  public get salt(): number {
    return Number(process.env.BCRYPT_SALT);
  }
  public get nodeEnv(): string {
    return String(process.env.NODE_ENV);
  }
  public get jwtS(): string {
    return String(process.env.JWT_SECRET);
  }
  public get jwtExp(): string {
    return String(process.env.JWT_EXPIRES_IN);
  }
  public get refreshS(): string {
    return String(process.env.REFRESH_TOKEN_SECRET);
  }
  public get refreshExp(): string {
    return String(process.env.REFRESH_TOKEN_EXPIRES_IN);
  }
  public get resetPassS(): string {
    return String(process.env.RESET_PASS_TOKEN);
  }
  public get resetPassExp(): string {
    return String(process.env.RESET_PASS_EXPIRES_IN);
  }
  public get resetPassLink(): string {
    return String(process.env.RESET_PASS_LINK);
  }
  public get nodeEmail(): string {
    return String(process.env.NODE_EMAIL);
  }
  public get nodeEmailPass(): string {
    return String(process.env.NODE_EMAIL_PASS);
  }
  public get cloudName(): string {
    return String(process.env.CLOUDINARY_CLOUD_NAME);
  }
  public get cloudApiKey(): string {
    return String(process.env.CLOUDINARY_API_KEY);
  }
  public get cloudApiS(): string {
    return String(process.env.CLOUDINARY_API_SECRET);
  }
}

export default new Config();

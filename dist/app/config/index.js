"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
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
        if (!process.env.STORE_ID) {
            throw new Error("STORE_ID is required in .env file");
        }
        if (!process.env.STORE_PASS) {
            throw new Error("STORE_PASS is required in .env file");
        }
        if (!process.env.SUCCESS_URL) {
            throw new Error("SUCCESS_URL is required in .env file");
        }
        if (!process.env.CANCEL_URL) {
            throw new Error("CANCEL_URL is required in .env file");
        }
        if (!process.env.FAIL_URL) {
            throw new Error("FAIL_URL is required in .env file");
        }
        if (!process.env.SSL_PAYMENT_API) {
            throw new Error("SSL_PAYMENT_API is required in .env file");
        }
        if (!process.env.SSL_VALIDATIOIN_API) {
            throw new Error("SSL_VALIDATIOIN_API is required in .env file");
        }
    }
    // Getters for environment variables
    get port() {
        return String(process.env.PORT);
    }
    get salt() {
        return Number(process.env.BCRYPT_SALT);
    }
    get nodeEnv() {
        return String(process.env.NODE_ENV);
    }
    get jwtS() {
        return String(process.env.JWT_SECRET);
    }
    get jwtExp() {
        return String(process.env.JWT_EXPIRES_IN);
    }
    get refreshS() {
        return String(process.env.REFRESH_TOKEN_SECRET);
    }
    get refreshExp() {
        return String(process.env.REFRESH_TOKEN_EXPIRES_IN);
    }
    get resetPassS() {
        return String(process.env.RESET_PASS_TOKEN);
    }
    get resetPassExp() {
        return String(process.env.RESET_PASS_EXPIRES_IN);
    }
    get resetPassLink() {
        return String(process.env.RESET_PASS_LINK);
    }
    get nodeEmail() {
        return String(process.env.NODE_EMAIL);
    }
    get nodeEmailPass() {
        return String(process.env.NODE_EMAIL_PASS);
    }
    get cloudName() {
        return String(process.env.CLOUDINARY_CLOUD_NAME);
    }
    get cloudApiKey() {
        return String(process.env.CLOUDINARY_API_KEY);
    }
    get cloudApiS() {
        return String(process.env.CLOUDINARY_API_SECRET);
    }
    get sslStoreId() {
        return String(process.env.STORE_ID);
    }
    get sslStorePassword() {
        return String(process.env.STORE_PASS);
    }
    get sslSuccessUrl() {
        return String(process.env.SUCCESS_URL);
    }
    get sslCancelUrl() {
        return String(process.env.CANCEL_URL);
    }
    get sslFailUrl() {
        return String(process.env.FAIL_URL);
    }
    get sslPaymentApi() {
        return String(process.env.SSL_PAYMENT_API);
    }
    get sslValidationApi() {
        return String(process.env.SSL_VALIDATIOIN_API);
    }
}
exports.default = new Config();

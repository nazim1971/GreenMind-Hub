"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const stream_1 = require("stream");
const config_1 = __importDefault(require("../app/config"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudName,
    api_key: config_1.default.cloudApiKey,
    api_secret: config_1.default.cloudApiS,
});
const sendImageToCloudinary = (imageName, buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ public_id: imageName.trim() }, (error, result) => {
            if (error) {
                reject(new Error(`Cloudinary upload error: ${error.message}`));
            }
            else {
                resolve(result);
            }
        });
        const readableStream = new stream_1.Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
// Multer memory storage configuration
const storage = multer_1.default.memoryStorage();
// Exporting multer upload middleware with memory storage
exports.uploadFile = (0, multer_1.default)({ storage: storage });

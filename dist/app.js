"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = require("./middlewires/globalErrorHandler");
const notFoundError_1 = require("./middlewires/notFoundError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const os_1 = __importDefault(require("os"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000"
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    const currentDateTime = new Date().toISOString();
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const serverDetails = {
        hostname: os_1.default.hostname(),
        platform: os_1.default.platform(),
        uptime: formatUptime(os_1.default.uptime()),
    };
    const clientDetails = {
        ipAddress: clientIp,
        accessedAt: currentDateTime,
    };
    const developerContact = {
        email: ["nazimmuddin10@gmail.com"],
    };
    res.status(200).send({
        success: true,
        message: "Welcome to GreenMind Hub Server",
        version: "1.0.0",
        clientDetails,
        serverDetails,
        developerContact,
    });
});
// Helper function to format uptime
function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
}
app.use('/api', routes_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFoundError_1.notFoundError);
exports.default = app;

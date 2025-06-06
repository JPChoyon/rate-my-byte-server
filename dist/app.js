"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://project-9-client-rho.vercel.app",
        "https://project-9-server.vercel.app",
    ],
}));
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is up and running",
    });
});
app.use("/api", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;

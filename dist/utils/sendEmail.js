"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendEmail = (email, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: config_1.default.email.sender,
            pass: config_1.default.email.pass,
        },
    });
    try {
        const info = yield transporter.sendMail({
            from: '"Alamin Sujon 👻" <alsujon2001@gmail.com>',
            to: email,
            subject: "Reset Your Password",
            html: `
               <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>Hi there,</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
          <p>Thanks,<br/>The Your Company Team</p>
        </div>

        `,
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email sending failed");
    }
});
exports.default = sendEmail;

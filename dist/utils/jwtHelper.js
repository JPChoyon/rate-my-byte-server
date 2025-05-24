"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate JWT
const generateToken = (payload, secret, expiresIn) => {
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
// Decode JWT
const decodedToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.jwtHelper = {
    generateToken,
    decodedToken,
};

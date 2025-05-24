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
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../generated/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prismaProvider_1 = __importDefault(require("../../utils/prismaProvider"));
const bcryptHelper_1 = require("../../utils/bcryptHelper");
const jwtHelper_1 = require("../../utils/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prismaProvider_1.default.user.findUnique({
        where: { email: payload === null || payload === void 0 ? void 0 : payload.email },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    const isPasswordMatch = yield bcryptHelper_1.bcryptHelper.comparePassword(payload === null || payload === void 0 ? void 0 : payload.password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password does not match");
    }
    const jwtData = {
        id: isUserExist.id,
        email: isUserExist.email,
        status: isUserExist.status,
        role: isUserExist.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtData, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(jwtData, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const registerNewUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prismaProvider_1.default.user.findUnique({
        where: { email: payload === null || payload === void 0 ? void 0 : payload.email },
    });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exist");
    }
    const hashedPassword = yield bcryptHelper_1.bcryptHelper.hashPassword(payload.password);
    payload.password = hashedPassword;
    const result = yield prismaProvider_1.default.user.create({ data: payload });
    const jwtData = {
        id: result.id,
        email: result.email,
        status: result.status,
        role: result.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtData, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(jwtData, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePasswordWithOldPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prismaProvider_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    const isPasswordMatch = yield bcryptHelper_1.bcryptHelper.comparePassword(payload.oldPassword, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Old password does not match");
    }
    const hashedPassword = yield bcryptHelper_1.bcryptHelper.hashPassword(payload.newPassword);
    const result = yield prismaProvider_1.default.user.update({
        where: { email: isUserExist.email },
        data: { password: hashedPassword },
    });
    return result;
});
const generateForgetPasswordLink = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prismaProvider_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const jwtData = {
        id: isUserExist.id,
        email: isUserExist.email,
        status: isUserExist.status,
        role: isUserExist.role,
    };
    const resetToken = jwtHelper_1.jwtHelper.generateToken(jwtData, config_1.default.reset_secret_key, config_1.default.reset_expires_in);
    const resetLink = `${config_1.default.website_url}/reset-password?email=${isUserExist.email}&token=${resetToken}`;
    yield (0, sendEmail_1.default)(isUserExist.email, resetLink);
    return null;
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prismaProvider_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const decodedToken = jwtHelper_1.jwtHelper.decodedToken(payload.token, config_1.default.reset_secret_key);
    if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.email) !== payload.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid token");
    }
    const hashedPassword = yield bcryptHelper_1.bcryptHelper.hashPassword(payload.newPassword);
    const result = yield prismaProvider_1.default.user.update({
        where: { email: payload.email },
        data: { password: hashedPassword },
    });
    return result;
});
const getMe = (jwtData) => __awaiter(void 0, void 0, void 0, function* () {
    return prismaProvider_1.default.user.findUnique({
        where: { email: jwtData.email },
    });
});
const generateAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jwtHelper_1.jwtHelper.decodedToken(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid token");
    }
    const isUserExist = yield prismaProvider_1.default.user.findUnique({
        where: { email: decoded.email },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    if (isUserExist.status !== prisma_1.UserStatus.ACTIVE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is not active");
    }
    const jwtData = {
        id: isUserExist.id,
        email: isUserExist.email,
        status: isUserExist.status,
        role: isUserExist.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtData, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
exports.authServices = {
    loginUser,
    registerNewUser,
    changePasswordWithOldPassword,
    generateForgetPasswordLink,
    resetPassword,
    getMe,
    generateAccessToken,
};

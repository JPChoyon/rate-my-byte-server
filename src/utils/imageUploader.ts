import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import { IFile } from "../types/file.type";
import fs from "fs";
import AppError from "../errors/AppError";
import status from "http-status";
cloudinary.config({
  cloud_name: config.cloudnary_cloud_name,
  api_key: config.cloudnary_api_key,
  api_secret: config.cloudnary_api_secret,
});

const imageUploader = async (file: IFile) => {
  try {
    const result = await cloudinary.uploader.upload(file?.path, {
      public_id: file?.originalname,
    });
    fs.unlinkSync(file?.path);
    return result;
  } catch (error) {
    throw new AppError(status.BAD_REQUEST, "Image upload failed");
  }
};

export default imageUploader;

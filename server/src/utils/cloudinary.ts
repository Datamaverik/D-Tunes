import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system to read,write, edit files on server
import env from "./validateEnv";

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    //  upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //  file has been uploaded
    console.log("File is uploaded on cloudinary", response.url);
    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath); //  remove the locally saved temporary file as the upload option failed
    return null;
  }
};

export { uploadOnCloudinary };

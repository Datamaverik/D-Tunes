import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system to read,write, edit files on server
import env from "./validateEnv";

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      console.log("file path not provided");
      return null;
    }
    //  upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //  file has been uploaded
    console.log("File is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath); //  remove the locally saved temporary file as the upload option failed
    return response;
  } catch (error) {
    return null;
  }
};

export const deleteFromCloudinary = async (publicId:string)=>{
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    return null;
  }
}

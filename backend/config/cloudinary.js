
import fs from "fs"
import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary = async (filePath)=>{

    try{

        // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
        api_secret: process.env.CLOUDINARY_CLOUD_SECRETKEY, // Click 'View API Keys' above to copy your API secret
    });

     // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
          filePath)
          fs.unlinkSync(filePath)
          return uploadResult.secure_url

    }catch(error){
          fs.unlinkSync(filePath)
          return res.status(500).json({message:"cloudinary error"})

    }
}

export default uploadOnCloudinary
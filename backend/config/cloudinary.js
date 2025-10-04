import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'



cloudinary.config({ 
  cloud_name: 'ds76wzsb7', 
  api_key: '238368551658762', 
  api_secret: '0Fy7jAy80mldn0RPqb65rjhYkkk'
});

console.log("Cloudinary ENV:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);


const storage = new multer.memoryStorage();

async function imageUploadUtil(file) 
{
    const result = await cloudinary.uploader.upload(file,{
        resource_type:'auto'
    });

    return result;
}

const upload = multer({storage});

export{upload,imageUploadUtil};
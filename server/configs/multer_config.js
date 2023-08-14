import path from "path"
import multer from "multer"
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(req.body.email){
           return cb(null, path.resolve("storage", "profile_pictures"))
        }
        if(req.body.isChatFile){
          return cb(null,path.resolve("storage","chat_files"))
        }
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9)
        return cb(null, uniqueSuffix + "_" + file.originalname )
      }
})

export function fileFilter (req,file,cb){
    // if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
      // } else {
      //   cb(new Error('Only image files are allowed.'), false); // Reject the file
      // }
}
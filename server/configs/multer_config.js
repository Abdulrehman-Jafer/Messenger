import path from "path"
import multer from "multer"
import { existsSync, mkdirSync } from "fs"
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(req.body.email){
           return cb(null, path.resolve("storage", "profile_pictures"))
        }
          const dir = `./storage/chat_files/${req.body.chatspace_id}`
          if(!existsSync(dir)){
              mkdirSync(dir,{recursive:true})
            }
          return cb(null,path.resolve("storage","chat_files",req.body.chatspace_id))
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9)
        let uniqueName = "undefineeddd";
        if(req.body.email){
           uniqueName = uniqueSuffix + "__" + file.originalname.replace(/\s+/g, "" )
        }
        console.log({body:req.body})
        uniqueName = uniqueSuffix + "_" + req.body.chatspace_id + "__" + file.originalname.replace(/\s+/g, "")
        return cb(null,uniqueName)
      }
})

export function fileFilter (req,file,cb){
    // if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
      // } else {
      //   cb(new Error('Only image files are allowed.'), false); // Reject the file
      // }
}

export const configged_multer = multer({storage,fileFilter})

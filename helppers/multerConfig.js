multer = require("multer"),
    path = require("path"),
    mimetype = ['image/png','image/jpeg','image/jpg','image/webp','image/gif'],
    { v4:uuidv4 }= require("uuid")


module.exports = {
    mimetype,

    multerDefaultStorage(route = "private") 
    {
        const storage = multer.diskStorage({
            destination: path.join(__dirname, `../storage/${route}`),
            filename: (req, file, cb)=>{
                cb(null, uuidv4() + '.' + file.mimetype.split('/')[1])
            }
        });
        
        return multer({ 
            storage: storage,
            fileFilter: (req, file, cb) => {
                if (mimetype.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error("Invalid file type"));
                }
            }
        });
    }


}




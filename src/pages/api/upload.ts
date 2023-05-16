import multer from "multer"

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/images",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default upload.single('uploadedFile')
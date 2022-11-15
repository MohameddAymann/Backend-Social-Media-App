import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './client-side/public/uploads')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
      },
  })
  
  const upload = multer({ storage }).single('images');

  export default upload;
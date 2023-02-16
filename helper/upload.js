const multer =require('multer')

exports.upload = multer({
    dest: 'uploads',
    
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|avi|mov|mwv|mkv)$/)) {
            return cb(new Error('Please upload a Video'))
        }
        cb(undefined, true)
    }
})
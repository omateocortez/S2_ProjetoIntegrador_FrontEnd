const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/imgs/uploads/")
    },
    filename: function(req, file, cb){

        if (typeof req.fileIndex === 'undefined') {
            req.fileIndex = 0
        }

        let projname = req.body.title.replace(/\s+/g, '-').toLowerCase()
        const name = `${projname}-${req.fileIndex}-${Date.now()}${path.extname(file.originalname)}`

        req.fileIndex++
        
        cb(null, name)
    }
})

const upload = multer({storage}).array('files[]')

module.exports = upload
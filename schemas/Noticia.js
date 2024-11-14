const mongoose = require('mongoose')

const Schema = mongoose.Schema
const NoticiaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    noticia_text:{
        type: String,
        required: true
    },
    images:{
        type: [String],
        default: ["imgs/no_img.png"],
        required: true
    },
    upload_date:{
        type: Date,
        default:Date.now,
        required: true
    },
    last_update_date:{
        type: Date,
        default:Date.now,
        required: true
    },
    creator_email:{
        type: String,
        required: true
    },
    last_editor_email:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Noticia', NoticiaSchema)
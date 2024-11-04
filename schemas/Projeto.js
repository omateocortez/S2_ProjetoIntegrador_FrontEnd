const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ProjSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    imgsrc:{
        type: String,
        default:"imgs/uploads/no_img.png",
        required: true
    },
    date:{
        type: Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Projeto', ProjSchema)
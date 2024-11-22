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
    images:{
        type: [String],
        default: ["imgs/no_img.png"],
        required: true
    },
    date:{
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

module.exports = mongoose.model('Projeto', ProjSchema)
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const EventoSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    evento_text:{
        type: String,
        required: true
    },
    images:{
        type: [String],
        default: ["imgs/no_img.png"],
        required: true
    },
    evento_date:{
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

module.exports = mongoose.model('Evento', EventoSchema)
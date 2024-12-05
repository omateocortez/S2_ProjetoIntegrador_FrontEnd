const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const UserSchema = new Schema({
    nome:{
        type: String,
        required: true
    },
    sobrenome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    senha:{
        type: String,
        required: true
    },
    funcionario:{
        type: Boolean,
        required:true,
        default: false
    },
    recebeForms:{
        type:Boolean,
        required:true,
        default: true
    },
    temp_code:{
        type:Number,
        default:null
    }
})
UserSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Usuario', UserSchema)
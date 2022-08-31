const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    accuracy: {
        type: Number,
        required: true
    },
    pp: {
        type: Number,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type' 
    },
    damage_class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoveDamageClass'
    }
})

module.exports = mongoose.model('Move', schema)
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    moves: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Move'
        }
    ],
    types: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }
    ],
    attack: {
        type: Number,
        required: true
    },
    defense: {
        type: Number,
        required: true
    },
    special_attack: {
        type: Number,
        required: true
    },
    special_defense: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true,
        minlength: 5
    },


})

module.exports = mongoose.model('Fakemon', schema)
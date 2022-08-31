const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    no_damage_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    half_damage_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    double_damage_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    no_damage_from: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    half_damage_from: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    double_damage_from: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    color: {
        type: String,
        required: true,
        minlength: 3
    }
})

module.exports = mongoose.model('Type', schema)
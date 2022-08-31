const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 5
    },
    image: {
        type: String,
        required: true,
        minlength: 5
    }
})

module.exports = mongoose.model('MoveDamageClass', schema)
const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
let Schema = mongoose.Schema;

let categoria = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La categoría debe tener una descripción"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: Usuario
    }
});

module.exports = mongoose.model('Categoria', categoria);
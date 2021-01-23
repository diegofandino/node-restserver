const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificarTokenImagen } = require('../middlewares/auth');

const app = express();

app.get('/imagen/:tipo/:img', verificarTokenImagen, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(path.resolve(__dirname, `../assets/no-image.jpg`));
    }


});

module.exports = app;
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//usar rutas
app.use(require('./routes/usuario'));
app.use(require('./routes/login'));




mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => { console.log("Base de datos ONLINE"); })
    .catch(error => handleError(error));

//escuchando el server
app.listen(process.env.PORT, () => { console.log(`Escuchando en puerto ${process.env.PORT}`); });
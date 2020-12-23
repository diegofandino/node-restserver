require('./config/config');

const express = require('express');
const app = express();


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get Usuarios');
});

app.post('/usuario', function(req, res) {

    let persona = req.body;

    if (persona.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "No se ha enviado el nombre de la persona"
        });
    } else {
        res.json({ persona });
    }

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({ id });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuarios');
});

app.listen(process.env.PORT, () => { console.log(`Escuchando en puerto ${process.env.PORT}`); });
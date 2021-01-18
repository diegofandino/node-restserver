const express = require('express');
const Categoria = require('../models/categoria');
const { verificarToken, verificarRole } = require('../middlewares/auth');
const { json } = require('body-parser');

let app = express();

//Traer todas las categorías
app.get('/categorias', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') //permite ordenar
        .populate('usuario', 'nombre email') //Obtiene la información de los objects id en este caso Usuario y solo
        //mostrando los campos de nombre y email
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });

});

//información de una sola categoría
app.post('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    msg: "La categoría no existe"
                }
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });

});

//Crear una categoría
app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });

});


//Actualizar categoría
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });

});

//Eliminar una categoría
app.delete('/categoria/:id', [verificarToken, verificarRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    msg: "La categoría no existe"
                }
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            msg: 'Categoría eliminada correctamente'
        });

    });

});

module.exports = app;
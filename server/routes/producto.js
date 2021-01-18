const express = require('express');
const Producto = require('../models/producto');
const { verificarToken } = require('../middlewares/auth');


let app = express();



//Obtener todos los productos

app.get('/productos', verificarToken, (req, res) => {

    let desde = req.params.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email') //Obtiene la información de los objects id en este caso Usuario y solo
        .populate('categoria', 'descripcion') //Obtiene la información de los objects id en este caso Categoria
        .skip(desde)
        .limit(5)
        //mostrando los campos de nombre y email
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

//Listar Producto por id
app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email') //Obtiene la información de los objects id en este caso Usuario y solo
        .populate('categoria', 'descripcion') //Obtiene la información de los objects id en este caso Categoria
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });

});

//crear Producto

app.post('/producto', verificarToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });

    });

});

//Actualizar Producto
app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;


        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoGuardado
            });

        });

    });

});

//eliminar producto

app.delete('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoBorrado,
                msg: 'Producto eliminado correctamente'
            })

        });

    });

});

//BUSCAR PRODUCTO

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {


    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //expresión regular

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion') //Obtiene la información de los objects id en este caso Categoria
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });


});

module.exports = app;
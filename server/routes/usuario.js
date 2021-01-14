const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const router = express.Router();
const Usuario = require('../models/usuario');
const { response } = require('express');
const { verificarToken, verificarRole } = require('../middlewares/auth');

router.get('/usuario', verificarToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({}, 'nombre email role estado google img') //Aquí seleccionamos los campos que queremos mostrar
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });

            });

        });

});

router.post('/usuario', [verificarToken, verificarRole], function(req, res) {

    let persona = req.body;

    let usuario = new Usuario({
        nombre: persona.nombre,
        email: persona.email,
        password: bcrypt.hashSync(persona.password, 10),
        role: persona.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

router.put('/usuario/:id', [verificarToken, verificarRole], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'role']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

router.delete('/usuario/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDesactivado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDesactivado) {

            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'No fue posible encontrar el usuario'
                }
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDesactivado,
        });

    });

    //ELIMINACION TOTAL DEL REGISTRO EN DB
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {

    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 mensaje: 'No fue posible encontrar el usuario'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // });

});


module.exports = router;
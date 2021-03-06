const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const usuario = require('../models/usuario');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req, resp) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario o contraseña incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return resp.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario o contraseña incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, 'este-es-el-seed-desarrollo', { expiresIn: process.env.CADUCIDAD });

        resp.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

//CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}
verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        msg: 'Debe utilizar una autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, 'este-es-el-seed-desarrollo', { expiresIn: process.env.CADUCIDAD });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }

        } else {
            //Si este usuario no existe en la DB

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, 'este-es-el-seed-desarrollo', { expiresIn: process.env.CADUCIDAD });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });

        }

    });

});

module.exports = app;
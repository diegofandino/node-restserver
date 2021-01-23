const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipos
    let tipos = ['usuarios', 'productos'];

    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: `Los tipos permitidos son: ${tipos.join(' - ')}`
        });
    }

    let sampleFile = req.files.archivo;
    let nombreCortado = sampleFile.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension del archivo
    let extensiones = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensiones.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: `Las extensiones válidas son ${extensiones.join(',')}`
        });
    }


    //Cambiar nombre del archivo (para prevenir repeticiones)
    let arhivoNombre = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    let uploadPath = `./uploads/${tipo}/${arhivoNombre}`;

    sampleFile.mv(uploadPath, function(err) {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Cargar la imagen del usuario
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, arhivoNombre);
        } else {
            imagenProducto(id, res, arhivoNombre);
        }

    });

});

let imagenUsuario = (id, res, arhivoNombre) => {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(arhivoNombre, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(arhivoNombre, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = arhivoNombre;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: arhivoNombre
            });

        });

    });
};

let imagenProducto = (id, res, arhivoNombre) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(arhivoNombre, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(arhivoNombre, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = arhivoNombre;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: arhivoNombre
            });

        });

    });

};

let borrarArchivo = (nombreImagen, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};

module.exports = app;
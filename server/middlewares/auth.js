// Verificar token
const jwt = require('jsonwebtoken');
const { response } = require('../routes/login');

let verificarToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();

    });

};


let verificarRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log(req.usuario);

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Este usuario no es rol ADMINISTRADOS'
            }
        });
    }

    next();

};


module.exports = {
    verificarToken,
    verificarRole
}
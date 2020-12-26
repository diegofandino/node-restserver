/// PUERTO CONFIGURACIÓN

process.env.PORT = process.env.PORT || 3000;

//ENTORNO HEROKU

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASES DE DATOS

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafeNode';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
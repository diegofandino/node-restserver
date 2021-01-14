/// PUERTO CONFIGURACIÓN

process.env.PORT = process.env.PORT || 3000;

//ENTORNO HEROKU

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//VENCIMIENTO DEL TOKEN
//60 segundos * 60 minutos * 24 horas * 30 días

process.env.CADUCIDAD = 60 * 60 * 24 * 30;

//SEED O SEMILLA DEL TOKEN
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//BASES DE DATOS

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafeNode';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
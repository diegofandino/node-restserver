/// PUERTO CONFIGURACIÓN

process.env.PORT = process.env.PORT || 3000;

//ENTORNO HEROKU

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASES DE DATOS

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafeNode';
} else {
    urlDB = 'mongodb+srv://strider:TsB0J9HW62WdRIqH@clustercafenode.dqooz.mongodb.net/cafeNode?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;
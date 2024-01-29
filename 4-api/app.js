const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes'); //importamos el router de tours

const userRouter = require('./routes/userRoutes'); //importamos el router de users

const app = express();

//morgan middleware
//dev es un formato de morgan que muestra en consola informacion de la request\
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//agregar un funcion al middleware stack que convierte el body de la request a json
app.use(express.json());

//sirve archivos estaticos (html, css, imagenes, etc)
app.use(express.static(`${__dirname}/public`));

//creacion de una funcion middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  //si no llamamos a next() la request se queda atrapada en el middleware stack y la respuesta nunca se envia
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//montamos los routers, los cuales son middlewares
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

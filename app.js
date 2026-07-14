const { version } = require('mongoose');
const config  = require('./src/config/env');
const express = require('express');
const routes = require('./src/routes/index');
const errorHandler = require('./src/middleware/errorHandler');
const app = express();



app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));


app.get('/',(req,res)=>{
  res.status(200).json({
    message:`${config.appName} API is running`, version: config.apiVersion
  })
});


app.use(`/api/${config.apiVersion}`,routes);














app.use(errorHandler);

module.exports = app;
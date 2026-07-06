const http = require('http');
const app = require('./app');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const { connectDB } = require('./src/config/db');

async function startServer() {
    await connectDB();
}


const port = config.port;
const host = config.host;

app.listen(port,host,()=>{
     logger.info(
       `🚀 ${config.appName} running on port ${port} [${config.env}]`,
     );

})
startServer()
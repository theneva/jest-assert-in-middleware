const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
 res.locals.message = 'hello';
 next();
});

app.get('/', (req, res) => {
 res.send(res.locals.message);
});

const server = app.listen();

module.exports = { app, port: server.address().port };

const fetch = require('node-fetch');

test('message is added to res.locals', async () => {
 const { app, port } = require('../server.js');

 let message;

 // add a middleware to the end of the chain
 app.use('/', (req, res, next) => {
  message = res.locals.message;
  next();
 });

 await fetch(`http://localhost:${port}/`);
 expect(message).toBe('something wrong');
});

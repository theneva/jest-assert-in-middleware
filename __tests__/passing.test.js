const fetch = require('node-fetch');

test('message is added to res.locals', () => {
 const { app, port } = require('../server.js');

 // add a middleware to the end of the chain
 app.use('/', (req, res, next) => {
  expect(res.locals.message).toBe('something wrong');
  next();
 });

 return fetch(`http://localhost:${port}/`);
});

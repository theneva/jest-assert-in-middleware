# Jest assertion in Express middleware doesn't fail

Express wraps all middleware functions in try blocks (so it can fall back to displaying an error page instead of exploding), so making assertions in a middleware is impossible with Jest.

Consider this test subject:

```js
// server.js

const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
 res.locals.message = 'hello';
 next();
});

app.get('/', (req, res) => {
 res.send(res.locals.message);
});

const server = app.listen(port);

module.exports = { app, port: server.address().port };
```

You could reasonably want to write a test that makes sure the middlewares have done their job before getting to the actual handler by adding a new middleware in a test:

```js
// __tests__/passing.server.test.js

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
```

This is impossible today because the Error thrown by `expect` is caught by Express, so Jest doesn't understand that the test has failed.

Instead, you have to do something like:

```js
// __tests__/failing.server.test.js

const fetch = require('node-fetch');

it('has added the message to res.locals', async () => {
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
```

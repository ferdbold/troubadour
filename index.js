const spotpadServer = require('./server/main.js');

const server = spotpadServer();
server.listen(server.get('port'), () => {
  console.log(`Find the server at: http://localhost:${server.get('port')}/`); // eslint-disable-line no-console
});

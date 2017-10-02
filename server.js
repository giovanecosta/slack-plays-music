var WebSocketServer = require('websocket').server;
const server = require('node-http-server');

var httpServer = new server.Server({
  port: 8000,
  root:'./public'
});

httpServer.deploy({}, serverReady);

var wsServer = new server.Server({
  port: 1337,
  root: '.'
});

wsServer.deploy({}, serverReady);

// create the server
wsServer = new WebSocketServer({
  httpServer: wsServer.server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  setInterval(function(){
    sendActivity(connection)
  }, 500);

});

function sendActivity(connection) {
  connection.sendUTF(JSON.stringify({text: 'affwfwew wefwefwefwafewf wFFEFWFF', channel: ''}));
}

function serverReady(server){
   console.log( `Server on port ${server.config.port} is now up`);
}

var WebSocketServer = require('websocket').server;
var server = require('node-http-server');
var uid = require('uid');

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

var channel;

var connections = {};

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
  connection.uid = uid(24);
  connections[connection.uid] = connection;

  connection.on('close', function(){
    delete connections[connection.uid];
  })
});

function sendActivity(text, channel, user) {
  var count = 0;
  for (var id in connections){
    connections[id].sendUTF(JSON.stringify({text: text, channel: channel, user: user}));
    count++;
  }
  console.log('Broadcasted for ' + count + ' connections.');
}

function serverReady(server){
  console.log( 'Server on port ' + server.config.port + ' is now up');
}

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log('Logged in as ' + rtmStartData.self.name + ' of team ' + rtmStartData.team.name);
});

rtm.on(RTM_EVENTS.MESSAGE, function (messageData) {
  var origin = false;
  var channel = rtm.dataStore.getChannelById(messageData.channel);
  var dm = rtm.dataStore.getDMById(messageData.channel);
  var user = rtm.dataStore.getUserById(messageData.user);
  var bot = rtm.dataStore.getBotById(messageData.user);
  var who = user || bot;

  if (channel) {
    origin = channel.name;
  } else if (dm) {
    origin = 'direct';
  }

  if (origin && who) {
    sendActivity(messageData.text, origin, who.name);
  }

});

rtm.start();

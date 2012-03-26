
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Events = require('./lib/events').Events;

var app = module.exports = express.createServer();

var io = require("socket.io").listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var events = new Events('localhost', 5984)

// Routes

app.get('/',      routes.index);
app.get('/tree',  routes.tree);
app.get('/time',  routes.time);
app.get('/graph', routes.graph);
app.get('/table', routes.table);

app.get('/events', function(req, res){
  events.findAll(function(error, docs){
    res.send(docs);
  });
})

events.changes(function(doc){
  io.sockets.emit('event', doc);
});

app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

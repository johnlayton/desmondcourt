var cradle = require('cradle')
    , util = require('util');

Events = function(host, port) {
  this.connection= new (cradle.Connection)(host, port, {
    cache : false,
    raw   : false
  });
  this.db = this.connection.database('events');
  /*
   this.db.save('_design/blog', {
   all: {
   map: function (doc) {
   if (doc.title) emit(doc.title, doc);
   }
   }
   });
   */
};

Events.prototype.findAll = function(callback) {
  this.db.view('events/all',function(error, result) {
//  this.db.all(function(error, result) {
    if( error ){
      util.log(error);
      callback(error)
    }else{
      var docs = [];
      util.log(util.inspect(result))
      result.forEach(function (doc){
        util.log(util.inspect(doc))
        docs.push(doc);
      });
      callback(null, docs);
    }
  });
};

Events.prototype.changes = function(callback) {
  var database = this.db
/*
  this.db.changes({ since: 1 }).on('response', function (res) {
    res.on('data', function (change) {
      console.log(change);
      database.get(change.id, function (err, doc) {
        console.log(change.id);
        console.log(doc);
        callback(doc);
      });
    });
    res.on('end', function () {
    });
  });
*/
  this.db.changes({ since: 1 }).on('change', function (change) {
    database.get(change.id, function (err, doc) {
//      console.log(change.id);
      console.log(doc);
      if (doc) {
        callback({ "id" : doc._id, "name": doc.name, "date": Date.parse(doc.date) });
      }
    });
  });
};

/*
Events.prototype.findById = function(id, callback) {
  this.db.get(id, function(error, result) {
    if( error ) callback(error)
    else callback(null, result)
  });
};

Events.prototype.save = function(events, callback) {
  if( typeof(events.length)=="undefined")
    events = [events];

  for( var i =0; i< events.length; i++ ) {
    event = events[i];
    event.created_at = new Date();
    if( article.comments === undefined ) article.comments = [];
    for(var j =0;j< article.comments.length; j++) {
      article.comments[j].created_at = new Date();
    }
  }

  this.db.save(events, function(error, result) {
    if( error ) callback(error)
    else callback(null, events);
  });
};
*/

exports.Events = Events;
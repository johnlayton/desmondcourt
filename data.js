var cradle = require('cradle')
   ,  util = require('util');

var conn   = new(cradle.Connection)('http://localhost', 5984, {});

var db     = conn.database('events');

/*
db.get(‘vader', function (err, doc) {

  doc.name; // 'Darth Vader'
  assert.equal(doc.force, 'dark');
});
*/

/*
db.save('_design/user', {
  views: {
    force: {
      map: "function (doc, force) { if(doc.force && doc.force == force) { emit(doc.username, doc) } }"
    }
  }
}, function (err, res) {

  if (err) {
      console.log(err);
  } else {
      // Handle success
      console.log("well done");
      console.log(res);
  }
}); 
*/


db.save([
  { name: "Serg", date: new Date(2012, 2, 21, 7, 30, 0) }
//  { name: "matt", date: new Date() }
], function (err, res) {

  if (err) {
      // Handle error
  } else {
      // Handle success
      console.log("well done");
      console.log(res);
  }
});


db.view('events/all',function(error, result) {
  if( error ){
    util.log(error);
  }else{
    result.forEach(function (doc){
      util.log(util.inspect(doc))
      util.log(util.inspect(doc.date))
      util.log(typeof(doc.date))
    });
  }
});

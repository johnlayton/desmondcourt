
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.tree = function(req, res){
  res.render('tree', { title: 'Tree' })
};

exports.time = function(req, res){
  res.render('time', { title: 'Time-Line' })
};

exports.graph = function(req, res){
  res.render('graph', { title: 'Graph' })
};

exports.table = function(req, res){
  res.render('table', { title: 'Table' })
};

exports.funnel = function(req, res){
  res.render('funnel', { title: 'Funnel' })
};

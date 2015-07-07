// Usage example with ExpressJS
var express = require('express'),
port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3030,
host = process.env.OPENSHIFT_NODEJS_IP;

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('./'));

// In your project, this would be require('node-gallery')
app.use('/', require('node-gallery')({
  staticFiles : 'resources',
  urlRoot : '/',
  title : 'imageboard', 
})
);

app.post('/todos/add', function(req,res) {

  res.contentType('applicaton/json');

  var todo = new Todo({
    title: req.body.title,
    done: false
  });

  todo.save(function(err) {
    if( err ) throw err;
    console.log("Todo Saved.")
    res.send( todo )
  });


})

app.get('/todos/',function(req,res) {

  Todo.find({}, function(err,todos) {

    res.send(todos);

  });
});


app.post('/todos/marktodo', function (req, res) {
  return Todo.findById(req.body.id, function (err, todo) {
    todo.done = req.body.status == 'done' ? true : false;
    return todo.save(function (err) {
      if (!err) {
        console.log("Todo Updated.");
      } else {
        console.log(err);
      }
      return res.send(todo);
    });
  });
});

/**
* Remove one Todo
*/
app.post('/todos/destroy', function (req, res) {
  return Todo.findById(req.body.id, function (err, todo) {
    return todo.remove(function (err) {
      if (!err) {
        console.log("Todo Removed.");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});


app.listen(port, host);
host = host || 'localhost';
console.log('node-gallery listening on ' + host  + ':' + port);

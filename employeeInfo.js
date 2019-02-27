let mysql = require('mysql');

let express = require('express');

let bodyParser = require('body-parser');

let fs = require('fs');

let app = express();



let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Emp'
});

app.use(function check(err, req, res, next) {
    connection.connect(function(error) {
      if (error) {
        res.writeHead(500, {
          'content-Type': 'text/plain'
        });
        res.end('500 Server Error, Something went wrong with the connection');
        console.log('Unexpected Connection problem ');
        connection.end();
      } else {
        console.log('Error in the query');
        res.writeHead(400, {
          'content-Type': 'text/plain'
        });
        res.end('400 Bad Request, Please check your query again');
        connection.end();
      }
    });
  next();
});


app.get('/', function(req, res) {
  fs.readFile('employee.html', function(err, data) {
    if (err) {
      res.writeHead(404);
      res.write(`File not found`);
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.write(data.toString());
      res.end();
    }
  });
});

app.get('/getall', function(req, res, next) {
  console.log('request was made: ' + req.url);
  connection.query("SELECT * FROM EmployeeDB " , function(error, rows) {
    if (error) {
      next (err);
      return;
    } else {
      res.writeHead(200, {
        'content-type': 'application/json'
      });
      console.log('Successful query');
      console.log(rows);
      res.end(JSON.stringify(rows));
    }
  });
});

app.get('/get', function(req, res, next) {
  let id = req.query.id
  connection.query("SELECT * FROM EmployeeDB WHERE EmpID = ?", [id] , function(error, rows, fields) {
    if (error) {
      res.send("errr")
      next (error);
      return;
    } else {
      res.writeHead(200, {
        'content-type': 'application/json'
      });
      console.log('Successful query');
      console.log(rows);
      res.end(JSON.stringify(rows));
    }
  });
});


app.get('/post', function(req, res) {

  var values = [ req.query.name, req.query.code]

  connection.query("INSERT INTO `EmployeeDB` ( `Name`, `EmpCode`) VALUES =?", [values], function(error, rows, fields) {
    if (error) {
      next (err);
      return;
    } else {
      res.writeHead(200, {
        'content-type': 'application/json',
        'content-Type': 'text/plain'
      });
      console.log('Successful query');
      console.log(rows);
      res.end(JSON.stringify(rows) + "\n" + 'Successfully inserted');
    }
  });
});


app.get('/delete', function(req, res){
  let id = req.query.id
  connection.query("DELETE FROM EmployeeDB WHERE EmpID = ?",[id], function(error, rows,  fields) {
    if (error) {
      next (err);
      return;
    } else {
      res.end(JSON.stringify(rows) + "\n" + 'Successfully Deleted');
    }
  });
});

app.get('/update', function(req, res, next) {
  let values = [req.query.id, req.query.name]
  connection.query("UPDATE `EmployeeDB` SET `Name`= ? WHERE EmpID = ?", [values] , function(error, rows) {
    if (error) {
      res.send("errr")
      next (error);
      return;
    } else {
      res.writeHead(200, {
        'content-type': 'application/json'
      });
      console.log('Successful query');
      console.log(rows);
      res.end(JSON.stringify(rows));
    }
  });
});


app.listen(3000,(err)=>{
  console.log("Now listening to port 4000",err);
});

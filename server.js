var express = require('express');
var request = require('request');
var app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// reply to request with "Hello World!"
app.get('/', function (req, res) {
  res.send('Greasidis Raspberry Pi 3! \n\n You requested nothing! PAOK');
});

app.get('/4', function (req, res) {
  makeHTTP('http://api.github.com/orgs/greasidis/members').then(result => {
  	res.send(result);
  }, err => {
	  res.sendStatus(err);
  });
});

// with host: ' + req.headers.host 
app.get('/*', function (req, res) {
  makeHTTP(req.params[0]).then(result => {
	  res.send(result);
  }, err => {
	  res.send(err);
  });

});

var options = {
  url: 'http://api.github.com/orgs/greasidis/members',
  headers: {
    'User-Agent': 'request'
  }
};

function makeHTTP(inputReq) {

	return new Promise((resolve, reject) => {
		request({url: inputReq, headers: {'User-Agent': 'request'}}, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    // var result = JSON.stringify(body);
		    var result = body;
		  	// console.log("Response.statusCode: " + response.statusCode);
		    resolve(result);
		  } else {
		  	// console.log("Error: " + error);
		    reject(error);
		  }
		});
	});
	
}


function makeHTTPstatic() {
	return new Promise((resolve, reject) => {
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
			  	var result = JSON.stringify(body);
			  	// console.log('Got the result');
			  	resolve(result);
			} else {
				reject(error);
			}
		});
	});

	// request(options, callback);
}



function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
  	var result = JSON.stringify(body);
  	console.log('Got the result');

    return result;
  }
}
	
//start a server on port 80 and log its start to our console
var server = app.listen(80, function () {

  var port = server.address().port;
  console.log('Listening on port ', port);

});

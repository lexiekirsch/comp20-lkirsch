// HEROKU

var cool = require('cool-ascii-faces');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_r7zfcq1v:95040fr1006i6hj6b24hcrfmhs@ds153637.mlab.com:53637/heroku_r7zfcq1v';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.set('port', (process.env.PORT || 5000));

app.post('/submit.json', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var name = req.body.username;
	var score = req.body.score; 
	var grid = req.body.grid;

	if (name != undefined && score != undefined && grid != undefined && validator.isAlphanumeric(name) && score > 0 && validator.isJSON(grid)) {

		var toInsert = {
			"username": name,
			"score": score,
			"grid": grid,
			"created_at": new Date()
		};

		// MONGO DB
		db.collection('scores', function(error, coll) {
			console.log("Error: " + error);
			coll.insert(toInsert, function(error, saved) {
				console.log("Saved: " + saved);
				if (error) {
					console.log("Error" + error);
					res.send(500);
				}
				else {
					res.send(200);
				}
			});
		});
	}
});

app.get('/cool', function(request, response) {
	response.send(cool());
});

app.get('/redline.json', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	request('http://developer.mbta.com/lib/rthr/red.json', function(err, response, body) {
		res.send(body);
	});
});

// FOR A SPECIFIC PLAYER
app.get('/scores.json', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var indexPage = '';
	var username = req.query.username;

	if (username == "") {
		res.send([]);
	}
	else {
		db.collection('scores', function(er, collection) {
			collection.find( { "username": username } ).sort( {score: -1 } ).toArray(function(err, results) {
				res.send(results);
			});
		});
	}
});

// FOR ALL PLAYERS
app.get('/', function(req, res) {
  	res.set('Content-Type', 'text/html');
	var indexPage = '';
	var array = [];
	db.collection('scores', function(er, collection) {
		collection.find().sort( {score: -1 } ).toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head>";
				indexPage += "<title>2048 High Scores</title><style>";
				indexPage += "table{ width: 100%; border: 2px solid #0000FF; border-radius: 5px; }";
				indexPage += "th, td { border: 1px solid #0000FF; background-color: #FFFF00; text-align: center; padding: 5px; } h1 { text-align: center; }";
				indexPage += "</style></head>";
				indexPage += "<body><h1>2048 High Scores</h1>";
				indexPage += "<table><tr><th>User</th><th>Score</th><th>Timestamp</th></tr>"
				for (var i = 0; i < cursor.length; i++) {
					indexPage += "<tr><td>" + cursor[i].username + "</td><td>" + cursor[i].score + "</td><td>" + cursor[i].created_at + "</td>";
				}
				indexPage += "</table></body></html>"
				res.send(indexPage);
			} 
			else {
				res.send('<!DOCTYPE HTML><html><head><title>2048 High Scores</title></head><body><h1>Error</h1></body></html>');
			}
		});
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
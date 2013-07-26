
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate')
  , MongoDBHelper = require("./mongodb-helper").MongoDBHelper
  , NodemailerHelper = require("./nodemailer-helper").NodemailerHelper
  , TembooHelper = require("./temboo-helper").TembooHelper;

const albarracinCalID = "nuevatroya.com.ar_56a0anfn8k9k2e1hrmr98h7718@group.calendar.google.com";
const capraroCalID = "nuevatroya.com.ar_le1t4bamnpbsh7ejm2ejsm2kgs@group.calendar.google.com";


/** ------------------------ OAUTH ------------------------*/
const gaccount = require('google-oauth-serviceaccount');
var access_token;
gaccount.auth(function(err, token){ 
		access_token = token;
});


/** ------------------------MAIN APP CONFIG  ------------------------*/

var app = express();

// assign the swig engine to .html files
app.engine('html', cons.swig);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());



/** ------------------------ HTTP & PATHS  ------------------------*/

var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var print_token = function(req,res){

	gaccount.auth(function(err, access_token){
		if(err)throw err;
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('token:'+access_token);
		console.log('token:'+access_token);
		res.end();
	});
}


var allEventsCallback = function(res){
	users.push({name : res});
}


app.get('/', function(req, res){

 res.render('index', {});

});

app.post('/createEvent', function(req, res){
  new TembooHelper().createEvent(req.body, access_token);
  res.writeHead(200, { 'Content-Type': 'application/json' }); 
  res.write(JSON.stringify(req.body));
  res.end();
 //res.render('index', {});

});


app.post('/sendMail', function(req, res){
  var locals = req.body;
  console.log("Procurando enviar un email. locals:", locals);
  new NodemailerHelper().sendMail(locals);
  res.writeHead(200, { 'Content-Type': 'application/json' }); 
  res.end();
 });


app.get('/capraro', function(req, res){

 res.render('gcal', {
    minTime :'9:00',
    maxTime: '19:00',
    hiddenDays: '[0]',
    calendarFeedUrl:'http://www.google.com/calendar/feeds/nuevatroya.com.ar_le1t4bamnpbsh7ejm2ejsm2kgs%40group.calendar.google.com/public/basic',
    calendarId: capraroCalID
  });

});

app.get('/albarracin', function(req, res){
res.render('gcal', {
    minTime :'9:30',
    maxTime: '18:30',
    hiddenDays: '[0,6]',
    calendarFeedUrl:'http://www.google.com/calendar/feeds/nuevatroya.com.ar_56a0anfn8k9k2e1hrmr98h7718%40group.calendar.google.com/public/basic',
    calendarId: albarracinCalID
  });

});

app.listen(3000);
console.log('Express server listening on port 3000');
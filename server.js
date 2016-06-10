//requirements, por favor!
var express = require('express');
var app = express();
var hbs  = require('express-handlebars');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose')
var bodyParser = require('body-parser') // <-- Added body parser... this is why your ajax/api calls were not getting any data

var port = Number(process.env.PORT || 3333);


// BODY PARSER <-- Added Body Parser settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

//HANDLEBARS!
app.engine('hbs', hbs({extname:'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

//Database configuration
// mongoose.connect('mongodb://localhost/mongoosescraper');
mongoose.connect('mongodb://test:test@ds037814.mlab.com:37814/heroku_mp6vbrhl');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


//the routes!

app.get('/', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			console.log(doc);
			res.render('index',{doc});
		}
	})
});

app.get('/scrape1', function(req, res) {

	var picSource = 'https://www.reddit.com/r/EarthPorn/'

  	request(picSource, function(error, response, html) {

  		mongoose.connection.db.dropDatabase(function(err, result) {
  			console.log('Database dropped, Site Scraped!')
  		});

	    var $ = cheerio.load(html);

	    $('a.title').each(function(i, element) {

			var result = {};

			result.title = $(this).text();

			var thisLink = $(this).attr('href');

			//this limits only those links whose last 3 letters are JPG.
			if(thisLink.slice(-3) == "jpg" || thisLink.slice(-3) == 'png'){
				result.link = $(this).attr('href');
			}

			var entry = new Article (result);

			entry.save(function(err, doc) {
		  		if (err) {
			    	console.log(err);
			  	} else {
			    	console.log(doc);
			    	// res.render('scrape',{doc})
			  	}
			});

		});

	});

	res.render('scrape',{'site':picSource})

});

app.get('/scrape2', function(req, res) {

	var picSource = 'https://www.reddit.com/r/VillagePorn/'

  	request(picSource, function(error, response, html) {

  		mongoose.connection.db.dropDatabase(function(err, result) {
  			console.log('Database dropped, Site Scraped!')
  		});

	    var $ = cheerio.load(html);

	    $('a.title').each(function(i, element) {

			var result = {};

			result.title = $(this).text();

			var thisLink = $(this).attr('href');

			//this limits only those links whose last 3 letters are JPG.
			if(thisLink.slice(-3) == "jpg" || thisLink.slice(-3) == 'png'){
				result.link = $(this).attr('href');
			}

			var entry = new Article (result);

			entry.save(function(err, doc) {
		  		if (err) {
			    	console.log(err);
			  	} else {
			    	console.log(doc);
			    	// res.render('scrape',{doc})
			  	}
			});

		});

	});

	res.render('scrape',{'site':picSource})

});

app.get('/scrape3', function(req, res) {

	var picSource = 'https://www.reddit.com/r/CityPorn/'

  	request(picSource, function(error, response, html) {

  		mongoose.connection.db.dropDatabase(function(err, result) {
  			console.log('Database dropped, Site Scraped!')
  		});

	    var $ = cheerio.load(html);

	    $('a.title').each(function(i, element) {

			var result = {};

			result.title = $(this).text();

			var thisLink = $(this).attr('href');

			//this limits only those links whose last 3 letters are JPG.
			if(thisLink.slice(-3) == "jpg" || thisLink.slice(-3) == 'png'){
				result.link = $(this).attr('href');
			}

			var entry = new Article (result);

			entry.save(function(err, doc) {
		  		if (err) {
			    	console.log(err);
			  	} else {
			    	console.log(doc);
			    	// res.render('scrape',{doc})
			  	}
			});

		});

	});

	res.render('scrape',{'site':picSource})

});


app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});


app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});


app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);
	
	console.log('req: ' + req.body); // req.body is empty that is why your notes dont show up the way you want -- You need body-parser for this to work.

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			console.log('newNote' + newNote); // <-- Just checking progress
			console.log('DOC: ' + doc ) // <-- Just checking progress
			
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});


//static files.
app.use('/public',express.static('public'));

app.listen(port, function() {
  console.log('SCRAPER listening on port %s!', port);
});

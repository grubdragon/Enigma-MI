var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET users listing. */
router.post('/leaderboard', function(req, res) {
    var userdb = db.get('users');
    var x = req.body['firstName'];
    var y = req.body['fbid'];
    var z = req.body['lastName'];
    var md5req = crypto.createHash('md5').update(x+y+z).digest('hex');
    userdb.findOne({ "hash" : md5req }, function(err, usr){
    	var user_leaderboard = userdb.find({},{"firstName":1,"lastName":1,"currLevel":1,"answered_time":1,"registered_time":1,_id:0, "fbid":0,"hash":0}).sort({"currLevel":-1,"answered_time":1,"registered_time":1});
    	var users=[];
    	for (var item in user_leaderboard) {
   			user+={"name":firstName+" "+lastName,"level":currLevel}
		}
    	res.send(user);
	});
});

router.post('/check', function(req, res){
	var userdb = db.get('users');
	var firstName = req.body['firstName'];
	var lastName = req.body['lastName'];
	var fbid = req.body['fbid'];
	var md5req = crypto.createHash('md5').update(firstName+fbid+lastName).digest('hex');
	userdb.findOne({ "hash" : md5req }, function(err, usr){
    	if (err) throw err;

		else if(usr){
			res.json({"success":"Checks out"});
		}

		else{
			res.json({"error":"No such user found"});
		}
	});
});

router.post('/', function(req, res) {
	var userdb = db.get('users');
	var firstName = req.body['firstName'];
	var lastName = req.body['lastName'];
	var fbid = req.body['fbid'];
	var hash = crypto.createHash('md5').update(firstName+fbid+lastName).digest('hex');

	userdb.findOne({ "fbid" : fbid }, function(err, usr){
		if (err) throw err;

		else if(usr){
			res.json({"error":"The user you're trying to signup already seems to exist."});
		}

		else{
			userdb.insertOne({
				"firstName":firstName,
				"lastName":lastName,
				"fbid":fbid,
				"currLevel": 1,
				"hash": hash,
				"registered_time": (new Date()).getTime(),
				"answered_time":Number.POSITIVE_INFINITY
			},function(err, result) {
				assert.equal(err, null);
				console.log("Inserted a document into the restaurants collection.");
				callback();
			});
		}
	});
});


module.exports = router;

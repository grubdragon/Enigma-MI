var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/treasure');
var assert = require('assert');

/* GET users listing. */
router.post('/leaderboard', function(req, res) {
	var userdb = db.get('users');
	var x = req.body['firstName'];
	var y = req.body['fbid'];
	var z = req.body['lastName'];
	var md5req = crypto.createHash('md5').update(y+"darsubhairocks").digest('hex');
	userdb.findOne({ "hash" : md5req }, function(err, usr){
		if(err){
			throw err;
		}
		else if(usr)
		{
			userdb.find({}, {sort: {currLevel: -1, answered_time: 1, registered_time: 1}}).then(function (users) {
				user_ranked=[];
				for (var i=0; i<users.length; i++) {
					var name = users[i]['firstName']+" "+users[i]['lastName'];
					var level = users[i]['currLevel'];
					var obj ={
						'rank': i+1,
						'name': name,
						'level': level
					};
					user_ranked.push(obj);
				}
				res.json(user_ranked);
			});
		}
		else{
			res.json({"error":"That ain't working though"})
		}

	});
});

router.post('/check', function(req, res){
	var userdb = db.get('users');
	var fbid = req.body['fbid'];
	var md5req = crypto.createHash('md5').update(fbid+"darsubhairocks").digest('hex');
	userdb.findOne({ "hash" : md5req }, function(err, usr){
		if (err) throw err;

		else if(usr){
			res.json(usr);
			res.status(200);
		}

		else{
			res.json({'error':'No such user found'});
			res.status(200);
		}
	});
});

router.post('/', function(req, res) {
	var userdb = db.get('users');
	console.log(req);
	var firstName = req.body['firstName'];
	var lastName = req.body['lastName'];
	var username = req.body['username'];
	var fbid = req.body['fbid'];
	var email = req.body['email'];
	var phone_no = req.body['phone_no'];
	var hash = crypto.createHash('md5').update(fbid+"darsubhairocks").digest('hex');

	userdb.findOne({ "fbid" : fbid }, function(err, usr){
		if (err) throw err;

		else if(usr){
			res.json({"error":"The user you're trying to signup already seems to exist."});
		}

		else{
			var time_n = (new Date()).getTime();
			userdb.insert({
				"firstName":firstName,
				"lastName":lastName,
				"fbid":fbid,
				"currLevel": 1,
				"email":email,
				"phone":phone_no,
				"hash": hash,
				"registered_time": time_n,
				"answered_time":25000000000000
			},function(err, result) {
				assert.equal(err, null);
				console.log("Inserted a user in the db");
				res.json({"success","Inserted a user in the db"});
			});
		}
	});
});


module.exports = router;

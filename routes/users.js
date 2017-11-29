var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {

	res.send('respond with a resource');
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
			res.json({"error":"The user you're trying to signup already seems to exist."})
		}
		
		else{
			userdb.insertOne({
				"firstName":firstName,
				"lastName":lastName,
				"fbid":fbid,
				"currLevel": 1,
				"hash": hash
			},function(err, result) {
				assert.equal(err, null);
				console.log("Inserted a document into the restaurants collection.");
				callback();
			});
		}
	});
});


module.exports = router;

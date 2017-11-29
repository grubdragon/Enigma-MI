var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/treasure');

/* GET home page. */
router.put('/', function(req, res, next) {
  res.render('index', { title: 'Treasure Hunt' });
});
/*
router.put('/:id', function(req, res){
    var collection = db.get('questions');
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video)
    });
});
*/

router.get('/:id', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var levelReq = req.query['levelReq'];
    
    var x = req.query['firstName'];
    var y = req.query['fbid'];
    var z = req.query['lastName'];
    var md5req = crypto.createHash('md5').update(x+y+z).digest('hex');

    userdb.findOne({ hash : md5req }, function(err, usr){
        if (err) throw err;
        console.log("usr: "+usr);
        if(isNaN(levelReq)){
    		levelReq = usr.currLevel
    		// or throw error
    	}
        if(parseInt(levelReq)>parseInt(usr.currLevel)){
        	levelReq = usr.currLevel
        }
    });
    
    questiondb.findOne({ level: levelReq }, function(err, question){
    	if (err) throw err;
    	res.json(question);
    });
    
});

module.exports = router;

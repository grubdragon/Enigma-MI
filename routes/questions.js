var express = require('express');
var sha3 = require('js-sha3');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/treasure');

/* GET home page. */
router.put('/', function(req, res, next) {
  res.render('index', { title: 'Treasure Hunt' });
});

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


router.get('/:id', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var levelReq = req.params.id;
    
    var x = req.body.firstName;
    var y = req.body.fbid;
    var z = req.body.lastName
    var sha3req = sha3.sha3_512(x+y+z);
    
    userdb.findOne({ hash : sha3req }, function(err, usr){
        if (err) throw err;
        if(isNaN(levelReq)){
    		levelReq = usr.currLvl
    		// or throw error
    	}
        if(parseInt(levelReq)>parseInt(usr.currLvl)){
        	levelReq = usr.currLvl
        }
    });
    
    questiondb.findOne({ level: levelReq }, function(err, question){
    	if (err) throw err;
    	res.json(question);
    });
    
});

module.exports = router;

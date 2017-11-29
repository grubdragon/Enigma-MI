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

router.post('/:id', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var levelReq = req.body['levelReq'];
    var x = req.body['firstName'];
    var y = req.body['fbid'];
    var z = req.body['lastName'];
    var md5req = crypto.createHash('md5').update(x+y+z).digest('hex');

    userdb.findOne({ hash : md5req }, function(err, usr){
        if (err) throw err;

        if(isNaN(levelReq)){
          levelReq = usr.currLevel
    	}

        if(levelReq>usr.currLevel){
        	levelReq = usr.currLevel
        }

        questiondb.findOne({ level: levelReq }, function(err, question){
            if (err) throw err;
            res.json(question);
        });

    });
    
});

module.exports = router;

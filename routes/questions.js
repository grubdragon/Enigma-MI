var express = require('express');
var sha3 = require('js-sha3');
var router = express.Router();

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

        res.json(video);
    });
});


router.get('/:id', function(req, res) {
    var collection = db.get('users');
    var levelReq = req.params.id;
    if(isNaN(levelReq)){
    	//throw error
    }
    
    var x = req.body.firstName;
    var y = req.body.fbid;
    var z = req.body.lastName
    var sha3req = sha3_512(x+y+z);
    
    collection.findOne({ hash : sha3req }, function(err, video){
        if (err) throw err;
    });
    
    res.json(video);
});

module.exports = router;

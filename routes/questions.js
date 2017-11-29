var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/treasure');

/* GET home page. */
router.post('/submit/:level', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var level = req.params['level'];
    var usr_ans = req.body['ans'];
    var x = req.body['firstName'];
    var y = req.body['fbid'];
    var z = req.body['lastName'];
    var md5req = crypto.createHash('md5').update(x+y+z).digest('hex');

    if(isNaN(level)){
        res.json({"error":"That ain't a level though"});
    }
    else{
        userdb.findOne({ hash : md5req }, function(err, usr){

            if (err) throw err;
            
            else if(usr){
                if(usr.currLevel<parseInt(level)){
                    res.json({"error":"Aukat se bahar nhp :'("});
                }
                else if(usr.currLevel>parseInt(level)){
                    res.json({"error":"You've already answered this question!"});
                }
                else{
                    questiondb.findOne({ "level": parseInt(level) }, function(err, q){
                        if (err) throw err;
                        else if(usr_ans == q.ans){
                            userdb.updateOne({"level": parseInt(level)}, {"currlevel": parseInt(level)+1});

                            res.json({"success":"Proceed to next level"});
                        }
                        else{
                            res.json({"error":"That wasn't quite right"});
                        }
                    });
                }
            }
            else{
                res.json({"error":"Request wasn't human. What're you upto mate?"});
            }
        });
    }
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

router.post('/:levelReq', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var levelReq = req.params['levelReq'];
    var x = req.body['firstName'];
    var y = req.body['fbid'];
    var z = req.body['lastName'];
    var md5req = crypto.createHash('md5').update(x+y+z).digest('hex');

    userdb.findOne({ hash : md5req }, function(err, usr){
        if (err) throw err;

        if(isNaN(levelReq) || levelReq>usr.currLevel){
            levelReq = usr.currLevel
        }

        questiondb.findOne({ level: levelReq }, function(err, q){
            if (err) throw err;
            res.json({"question":q.questions, "img-src":q.img-src});
        });

    });
    
});

module.exports = router;

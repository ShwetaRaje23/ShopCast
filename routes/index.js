var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ShopCast' });
});

//// this is the post request for the caster
app.post('/api/cast', function(req, res) {

  //res.render('index', { title: 'Express' });
    console.log("printing the json for caster");
    res.send("Got a POST REQUEST");
    console.log(res);

});


// this is the get request for the asker to get the feed
router.get('/api/ask', function(req, res) {

    //res.render('index', { title: 'Express' });
    console.log("printing the json for asker");
    console.log(req);
    console.log(res);

});

module.exports = router;

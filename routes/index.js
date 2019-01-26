var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/reserve', function(req, res, next) {
  console.log("test");
  //logic connecting to db
  res.send('/');
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Read from database
  // if open, send flag saying its open
  // else send flase that its reserved
  res.render('index', { title: 'bookit' });
});

router.post('/reserve', function(req, res) {
  //logic saving to db - say the room is now reserved
  res.send('room reserved');
});



module.exports = router;

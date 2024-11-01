var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/metrics', function(req, res, next) {
  res.render('Metrics data');
});

module.exports = router;

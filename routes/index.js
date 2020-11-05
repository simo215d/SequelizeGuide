var express = require('express');
var router = express.Router();
const controllers = require('../controllers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/posts', controllers.createPost);

router.get('/posts', controllers.getAllPosts);

module.exports = router;

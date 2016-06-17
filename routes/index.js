var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post  = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET all Posts */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if(err) { return next(err); }

    res.json(posts);
  });
});

/* POST post */
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err) { return next(err); }

    res.json(post);
  });
});

/* PARAM for loading pre-loading post */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if(err) { return next(err); }
    if(!post) { return next(new Error("Can't find post")); }

    req.post = post;
    return next();
  })
})

/* GET particular post */
router.get('/posts/:post', function(req, res) {
  res.json(req.post);
});

/* PUT upvote post */
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if(err) { return next(err); }

    res.json(post);
  });
});

/* POST new comment */
router.post('/posts/:post/comments/', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.save(function(err, comment) {
    if(err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err) { return next(err); }

      res.json(comment);
    });
  });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
// Initialize express router
let router = require('express').Router();

let usersController = require('./controllers/usersController');
let commentsController = require('./controllers/commentsController');
       
    

// Set default API response
router.get('/', function (req, res) 
{
    res.json(
    {
       status: 'API Its Working',
       message: 'Welcome to Reactflix backend!',
    });
});

/*******************
 * USER ENDPOINT
 *******************/

router.get('/users',function(req,res)
{
    usersController.index(req,res);
});

router.get('/users/:id',function(req,res)
{
    usersController.view(req,res);
});

router.post('/users',function(req,res)
{
    usersController.add(req,res);
});

router.post('/users/login',function(req,res)
{
    usersController.login(req,res);
});

router.delete('/users/:id',function(req,res)
{
    usersController.remove(req,res);
});

router.put('/users/:id',function(req,res)
{
    usersController.edit(req,res);
});

/**
 * Get all comments made by :userId for a movie :movieId
 */
router.get('/users/:userId/movies/:movieId/comments',function(req,res)
{
    commentsController.getUserCommentsOnMovie(req,res);
});

/**
 * Get all comments for a movie :movieId
 */
router.get('/movies/:movieId/comments',function(req,res)
{
    commentsController.getMovieComments(req,res);
});

/*******************
 * COMMENT ENDPOINT
 *******************/

router.get('/comments',function(req,res)
{
    commentsController.index(req,res);
});

router.get('/comments/:id',function(req,res)
{
    commentsController.view(req,res);
});

router.post('/comments',function(req,res)
{
    commentsController.add(req,res);
});

router.delete('/comments/:id',function(req,res)
{
    commentsController.remove(req,res);
});

router.put('/comments/:id',function(req,res)
{
    commentsController.edit(req,res);
});

// Export API routes
module.exports = router;
const express = require("express");
const morgan = require("morgan");
const { environment } = require('../config');
const router = express.Router();
const db = require('../db/models');
const {check, validationResult } = require('express-validator');
const { asyncHandler, handleValidationErrors } = require("../../utils");
const { Tweet } = db;
const {requireAuth} = require('../auth')

function tweetNotFoundError(tweetId) {
  const error = new Error(`Tweet ${ tweetId } not found`);

  error.title = 'Tweet not found';
  error.status = 404;

  return error;
}


//check returns a middleware, hence next() is not needed
const tweetValidations = [
  check('message')
    .exists({ checkFalsy: true})
    .withMessage('tweet should be present')
    .isLength({ max: 280})
    .withMessage('tweet should not over 280 characters long')
]

router.use(requireAuth)

router.get("/", asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll()
    res.json({
      tweets
    });
}));

router.get("/:id(\\d+)", asyncHandler(async(req, res, next) => {
    const tweetId = req.params.id;
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      next(tweetNotFoundError(tweetId))
    } else {
      res.json({tweet});
    }
}));

router.post('/', tweetValidations, handleValidationErrors, asyncHandler(async (req, res,) => {

  const tweet = req.body.message
  res.json(tweet)
}))

router.put('/:id(\\d+)', tweetValidations, handleValidationErrors, asyncHandler(async(req, res) => {
    const tweetId = req.params.id;

    const testTweet = await Tweet.findByPk(tweetId);

    if(!testTweet) {
      next(tweetNotFoundError(tweetId))
    } else {
      const tweet = await Tweet.update({
          message: req.body.message
      }, {where: { id: tweetId }})

      res.redirect(`/tweets/${tweetId}`);
    }

}))

router.delete('/:id(\\d+)', tweetValidations, asyncHandler(async(req, res) => {
  const tweetId = req.params.id;

  const testTweet = await Tweet.findByPk(tweetId);

  if(!testTweet) {
    next(tweetNotFoundError(tweetId))
  } else {
    const tweet = await Tweet.destroy({
      where: {
        id: tweetId
      }
    })
    res.status(204).end()
  }

}));

module.exports = router

const express = require('express');
const app = express();
const gameRoute = express.Router();

let Game = require('../models/Game');

gameRoute.route('/game/add').post((req, res, next) => {
  Game.create(req.body, (err, data) => {
    if (err) {
      return next(err)
    } else {
      res.json(data)
    }
  })
});

gameRoute.route('/game').get((req, res) => {
  Game.find((err, data) => {
    if(err) {
      return next(err)
    } else {
      res.json(data)
    }
  })
})

gameRoute.route('/game/:id').get((req, res) => {
  Game.findById(req.params.id, (err, data) => {
    if(err) {
      return next(err)
    } else {
      res.json(data)
    }
  })
})

gameRoute.route('/game/update/:id').put((req, res, next) => {
  Game.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (err, data) => {
    if (err) {
      return next(err)
      console.log(err)
    } else {
      res.json(data)
      console.log('Game successfully updated.')
    }
  })
})

gameRoute.route('/game/delete/:id').delete((req, res, next) => {
  Game.findByIdAndRemove(req.params.id, (err, data) => {
    if(err) {
      return next(err)
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = gameRoute;

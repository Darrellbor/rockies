var express = require('express');
var router = express.Router();

var eventsCtrl = require('../controllers/events.controller.js');

router
    .route('/events/search')
    .post(eventsCtrl.getAllEvents);

router 
    .route('/events/check')
    .get(eventsCtrl.checkEventTitle);

router 
    .route('/events')
    .post(eventsCtrl.eventsAddOne);

router 
    .route('/events/:id')
    .get(eventsCtrl.eventsGetOne)
    .put(eventsCtrl.eventsUpdateOne)
    .delete(eventsCtrl.eventsDeleteOne);

module.exports = router;
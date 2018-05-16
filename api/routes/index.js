var express = require('express');
var router = express.Router();

var eventsCtrl = require('../controllers/events.controller.js');
var ordersCtrl = require('../controllers/orders.controller.js');
var reviewsCtrl = require('../controllers/reviews.controller.js');

router
    .route('/events/search')
    .get(eventsCtrl.checkEventTitle)
    .post(eventsCtrl.getAllEvents);
    
router 
    .route('/events')
    .post(eventsCtrl.eventsAddOne);

router 
    .route('/events/:id')
    .get(eventsCtrl.eventsGetOne)
    .put(eventsCtrl.eventsUpdateAll)
    .patch(eventsCtrl.eventsUpdateOne)
    .delete(eventsCtrl.eventsDeleteOne);

router 
    .route('/events/organizer/:id')
    .get(eventsCtrl.organizerGetEvents);

router
    .route('/events/:id/orders')
    .get(ordersCtrl.getAllOrders)
    .post(ordersCtrl.orderAddOne);

router
    .route('/events/:id/reviews')
    .get(reviewsCtrl.getAllReviews)
    .post(reviewsCtrl.reviewAddOne);

router
    .route('/events/:id/reviews/:reviewId')
    .put(reviewsCtrl.reviewUpdateOne)
    .delete(reviewsCtrl.reviewDeleteOne);

module.exports = router;
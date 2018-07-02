var express = require('express');
var router = express.Router();

var eventsCtrl = require('../controllers/events.controller.js');
var ordersCtrl = require('../controllers/orders.controller.js');
var reviewsCtrl = require('../controllers/reviews.controller.js');
var usersCtrl = require('../controllers/users.controller.js');

router
    .route('/events/search')
    .get(eventsCtrl.checkEventTitle)
    .post(eventsCtrl.getAllEvents);
    
router 
    .route('/events')
    .post(usersCtrl.authenticate, eventsCtrl.eventsAddOne);

router 
    .route('/events/uploadImage')
    .post(usersCtrl.authenticate, eventsCtrl.eventUploadImage);

router 
    .route('/events/:id')
    .get(eventsCtrl.eventsGetOne)
    .put(usersCtrl.authenticate, eventsCtrl.eventsUpdateAll)
    .patch(eventsCtrl.eventsUpdateOne)
    .delete(usersCtrl.authenticate, eventsCtrl.eventsDeleteOne);

router 
    .route('/events/organizer/:id')
    .get(eventsCtrl.organizerGetEvents);

router
    .route('/events/:id/orders')
    .get(usersCtrl.authenticate, ordersCtrl.getAllOrders)
    .post(usersCtrl.authenticate, ordersCtrl.orderAddOne);

router
    .route('/events/:id/reviews')
    .get(reviewsCtrl.getAllReviews)
    .post(usersCtrl.authenticate, reviewsCtrl.reviewAddOne);

router
    .route('/events/:id/reviews/:reviewId')
    .put(usersCtrl.authenticate, reviewsCtrl.reviewUpdateOne)
    .delete(usersCtrl.authenticate, reviewsCtrl.reviewDeleteOne);

module.exports = router;
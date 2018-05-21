var express = require('express');
var router = express.Router();

var usersCtrl = require('../controllers/users.controller.js');

router
    .route('/users/register')
    .post(usersCtrl.registerUser);

router
    .route('/users/login')
    .post(usersCtrl.loginUser);

router
    .route('/users/profile')
    .get(usersCtrl.authenticate, usersCtrl.getUserProfile)
    .put(usersCtrl.authenticate, usersCtrl.editAllUserProfile)
    .patch(usersCtrl.authenticate, usersCtrl.editOneUserProfile);

router
    .route('/users/tickets')
    .get(usersCtrl.authenticate, usersCtrl.getAllUserOrders);

router
    .route('/users/events')
    .get(usersCtrl.authenticate, usersCtrl.getAllUserEvents);

router
    .route('/users/events/:id/tickets/:orderId')
    .get(usersCtrl.authenticate, usersCtrl.getOneUserOrders);

router
    .route('/users/events/reviews')
    .get(usersCtrl.authenticate, usersCtrl.getOrderReviews);

router
    .route('/users/forgotPassword')
    .post(usersCtrl.userForgotPassword);

router
    .route('/users/feedback')
    .post(usersCtrl.authenticate, usersCtrl.userFeedback);

module.exports = router;
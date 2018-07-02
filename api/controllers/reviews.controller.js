var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

module.exports.getAllReviews = function(req, res) {
    var eventLink = req.params.id;
    console.log("GET event!", eventLink);

    Event
        .findOne({
             eventLink: eventLink,
             endDate: { $lt : new Date() }
             
        })
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding reviews');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event not found, cannot get reviews for an event that has not ended! '+ eventLink
                }
            } else {
                 console.log('Found reviews ', doc.reviews.length);
                 response.message = doc.reviews.length !== 0 ? doc.reviews : { message: 'There are no reviews to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

var _addReview = function(req, res, event) {
    var sentimentRating = sentiment.analyze(req.body.review);
    
    event.reviews.push({
        reviewBy: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        },
        review: req.body.review,
        sentimentRating: sentimentRating.score
    });

    event.save(function(err, reviewAdded) {
        if(err) {
            res
                .status(500)
                .json({
                    err,
                    message: "An error occured!"
                })
        } else {
            res 
                .status(201)
                .json(reviewAdded.reviews[reviewAdded.reviews.length -1])
        }
    });
}

module.exports.reviewAddOne = function(req, res) {
    var eventLink = req.params.id;
    
    if(!req.body.review) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    Event
        .findOne({
             eventLink: eventLink,
             endDate: { $lt : new Date() },
             "orders.buyer._id": req.user._id
        })
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding reviews');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event not found, cannot add a review to an event that has not ended, neither can you review an event that you did not order for!'+ eventLink
                }
            } 
            
            if(doc) {
                _addReview(req, res, doc);
            } else {
                  res 
                    .status(response.status)
                    .json(response.message)
            }
        });
}

module.exports.reviewUpdateOne = function(req, res) {
    var eventLink = req.params.id;
    var reviewId = req.params.reviewId;
    console.log("GET event!", eventLink);

    Event
        .findOne({
             eventLink: eventLink,
             endDate: { $lt : new Date() }             
        })
        .select('reviews')
        .exec(function(err, event) {
            var reviewInstance = {};
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding reviews');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!event) {
                response.status = 404;
                response.message = {
                    message: 'Event not found, '+ eventLink
                }
            } else {
                reviewInstance = event.reviews.id(reviewId);

                if(!reviewInstance) {
                    response.status = 404;
                    response.message = {
                        message: 'Review not found, '+ reviewId
                    }
                } 
            } 

            if(response.status != 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {
                
                if(!req.body.review) {
                    res 
                        .status(400)
                        .json({message: 'Please ensure all fields are filled '})
                    return;
                }
                console.log(reviewInstance);
                var sentimentRating = sentiment.analyze(req.body.review);
                reviewInstance.review = req.body.review;
                reviewInstance.sentimentRating = sentimentRating.score;
                
                event.save(function(err, updatedReview) {
                    if(err) {
                        res 
                            .status(500)
                            .json({
                                err, 
                                message: "An error occured!"
                            })
                    } else {
                        res 
                            .status(204)
                            .json()
                    }
                });
            }
        });
}

module.exports.reviewDeleteOne = function(req, res) {
    var eventId = req.params.id;
    var reviewId = req.params.reviewId;
    console.log("GET event!", eventId);

    Event
        .findOne({
             _id: eventId,
             endDate: { $lt : new Date() }
        })
        .select('reviews')
        .exec(function(err, event) {
            var reviewInstance = {};
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding reviews');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!event) {
                response.status = 404;
                response.message = {
                    message: 'Event not found, '+ eventId
                }
            } else {
                reviewInstance = event.reviews.id(reviewId);

                if(!reviewInstance) {
                    response.status = 404;
                    response.message = {
                        message: 'Review not found, '+ reviewId
                    }
                } 
            } 

            if(response.status != 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {
                event.reviews.id(reviewId).remove();
                
                event.save(function(err, updatedReview) {
                    if(err) {
                        res 
                            .status(500)
                            .json({
                                err, 
                                message: "An error occured!"
                            })
                    } else {
                        res 
                            .status(204)
                            .json()
                    }
                });
            }
        });
}
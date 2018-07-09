var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var Settings = mongoose.model('Settings');
var Feedback = mongoose.model('Feedback');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var db_config = require('../data/db_config');

module.exports.registerUser = function(req, res) {
    console.log('Register a user');

    if(!req.body.email || !req.body.name.first || !req.body.name.last || !req.body.password) {
        res 
            .status(400)
            .json({
                message: 'Please ensure all fields are filled'
            })
        return;
    }

    User    
        .create({
            email: req.body.email.toLowerCase(),
            "name.first": req.body.name.first,
            "name.last": req.body.name.last,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) 
        }, function(err, user) {
            if(err) {
                if(err.errmsg != null) {
                    res
                        .status(400)
                        .json({
                            message: "Email already exists!"
                        })
                } else if(err.errors.email.message != null) {
                    res
                        .status(400)
                        .json({ 
                            message: err.errors.email.message
                        })
                } else {
                    res
                        .status(400)
                        .json({
                            err, 
                            message: "An error occured!"
                        })
                }
            } else {
                res
                    .status(201)
                    .json(user)
            }
        });
}

module.exports.loginUser = function(req, res) {
    console.log("Login a user");

    if(!req.body.email || !req.body.password) {
        res 
            .status(400)
            .json({
                message: 'Please ensure all fields are filled'
            })
        return;
    }

    User
        .findOne({
            email: req.body.email.toLowerCase()
        })
        .exec(function(err, user) {
            if(err) {
                res
                    .status(400)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else {
                if(!user) {
                    res
                        .status(401)
                        .json({message: 'Invalid email!'})
                    return;
                }

                if(bcrypt.compareSync(req.body.password, user.password)) {
                    if(user.confirmed === "Yes") {
                        let token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, db_config.secret, { expiresIn: 604800 }); //expires after 1 week
                        res
                            .status(200)
                            .json({Success: true, token: token})
                    } else {
                        res
                            .status(401)
                            .json({message: 'Account not confirmed, confirm your account to countinue'})
                    }
                } else {
                    res
                        .status(401)
                        .json({message: 'Incorrect password!'})
                } 
                
            }
        });
}

module.exports.getUserProfile = function(req, res) {
    console.log('GET a user profile');

    User
        .findOne({ _id: req.user._id })
        .select("-organizerProfiles -password")
        .exec(function(err, user) {
            if(err) {
                res
                    .status(500)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else if(!user) {
                res
                    .status(404)
                    .json({message: "User not found!"})
            } else {
                res
                    .status(200)
                    .json(user)
            }
        });
}

module.exports.editAllUserProfile = function(req, res) {
    console.log('Edit full user details');

    var suppliedData = {};

    if(!req.body.name.first || !req.body.name.last) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    if(req.body.email) {
        res 
            .status(403)
            .json({message: 'You cannot change your email'})
        return;
    }

    var response = {
            status: 204,
            message: {}
        }

    
    User   
        .findOne({
            "_id": req.user._id
        })
        .exec(function(err, user) {
            if(err) {
                console.log('Error finding user');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else {
                suppliedData = {
                    "name": req.body.name
                }

                User
                    .update({
                        "_id": req.user._id
                    }, suppliedData, function(err, updatedUser) {
                        if(err) {
                            response.status = 500;
                            response.message = {
                                err, 
                                message: "An error occured!"
                            };
                        } else {
                            response.status = 204;
                            response.message = {};
                        } 
                    });
            }
        });

    res
        .status(response.status)
        .json(response.message);
}

module.exports.editOneUserProfile = function(req, res) {
    console.log('Update a particular part of a user profile');

    var suppliedData = {};

    var response = {
            status: 200,
            message: {}
        }

    if(req.body.type === "Confirm") {
        suppliedData = {
            confirmed: "Yes"
        }
    } else if(req.body.type === "Password" && req.body.oldPassword &&
        req.body.newPassword && req.body.confirmNewPassword) {
            
            User
                .findOne({ _id: req.user._id })
                .select("password")
                .exec(function(err, user) {
                    if(err) {
                        response.status = 500;
                        response.message = {
                            err, 
                            message: "An error occured!"
                        };
                    } else if(!user) {
                        response.status = 404;
                        response.message = {
                            message: "User not found!"
                        };
                    } else {
                        if(bcrypt.compareSync(req.body.oldPassword, user.password)) {
                            if(req.body.newPassword != req.body.confirmNewPassword) {
                                response.status = 403;
                                response.message = {
                                    message: "New passwords do not match!"
                                };
                            } else if(bcrypt.compareSync(req.body.newPassword, user.password)) {
                                response.status = 403;
                                response.message = {
                                    message: "New password cannot be the same old password!"
                                };
                            } else {
                                suppliedData = {
                                    password: bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10)) 
                                }
                            }
                        } else {
                            response.status = 403;
                            response.message = {
                                message: "Invalid old password!"
                            };
                        }
                    }
                });
    } else if(req.body.type === "Incomplete Event" && req.body.function === "Add" && req.body._id && 
        req.body.title &&  req.body.eventLink && req.body.exclusive && req.body.startDate && 
        req.body.eventImage && req.body.category && req.body.address && req.body.eventType && req.body.cost) {
            User
                .findOne({ _id: req.user._id })
                .select("explore.incompleteEventOrders")
                .exec(function(err, user) {
                    if(err) {
                        response.status = 500;
                        response.message = {
                            err, 
                            message: "An error occured!"
                        };
                    } else if(!user) {
                        response.status = 404;
                        response.message = {
                            message: "User not found!"
                        };
                    } else {
                        user.explore.incompleteEventOrders.push({
                            _id: req.body._id,
                            title: req.body.title,
                            eventLink: req.body.eventLink,
                            exclusive: req.body.exclusive,
                            startDate: req.body.startDate,
                            eventImage: req.body.eventImage,
                            category: req.body.category,
                            address: req.body.address,
                            eventType: req.body.eventType,
                            cost: req.body.cost
                        });

                        user.save(function(err, eventOrdersAdded) {
                            if(err) {
                               response.status = 500;
                               response.message = {
                                    err, 
                                    message: "An error occured!"
                               };
                            } else {
                               response.status = 201;
                               response.message = {
                                    message: eventOrdersAdded.explore.incompleteEventOrders[eventOrdersAdded.explore.incompleteEventOrders.length -1]
                               };
                            }
                        });
                    }
                });

    } else if(req.body.type === "Incomplete Event" && req.body.function === "Remove" && req.body._id) {
            User
                .findOne({ _id: req.user._id })
                .select("explore.incompleteEventOrders")
                .exec(function(err, user) {
                    if(err) {
                        response.status = 500;
                        response.message = {
                            err, 
                            message: "An error occured!"
                        };
                    } else if(!user) {
                        response.status = 404;
                        response.message = {
                            message: "User not found!"
                        };
                    } else {
                        user.explore.incompleteEventOrders.id(req.body._id).remove();

                        user.save(function(err, eventOrdersAdded) {
                            if(err) {
                               response.status = 500;
                               response.message = {
                                    err, 
                                    message: "An error occured!"
                               };
                            } 
                        });
                    }
                });

    } else if(req.body.type === "Categories" && req.body.name) {
            User
                .findOne({ _id: req.user._id })
                .select("explore.categories")
                .exec(function(err, user) {
                    if(err) {
                        response.status = 500;
                        response.message = {
                            err, 
                            message: "An error occured!"
                        };
                    } else if(!user) {
                        response.status = 404;
                        response.message = {
                            message: "User not found!"
                        };
                    } else {

                        User
                            .findOne({
                                 _id: req.user._id,
                                 "explore.categories.name": req.body.name
                            })
                            .select("explore.categories")
                            .exec(function(err, category) {
                                if(err) {
                                    response.status = 500;
                                    response.message = {
                                        err, 
                                        message: "An error occured!"
                                    };
                                } else if(!category) {
                                    user.explore.categories.push({
                                        name: req.body.name,
                                        times: 1
                                    });

                                    user.save(function(err, categoryAdded) {
                                        if(err) {
                                            response.status = 500;
                                            response.message = {
                                                    err, 
                                                    message: "An error occured!"
                                            };
                                        } else {
                                            response.status = 201;
                                            response.message = {
                                                    message: categoryAdded.explore.categories[categoryAdded.explore.categories.length -1]
                                            };
                                        }
                                    });
                                } else {
                                    var newCategorytimes = "";

                                    for(var i = 0; i < category.explore.categories.length; i++) {
                                        if(category.explore.categories[i].name === req.body.name) {
                                            newCategorytimes = category.explore.categories[i].times + 1;
                                            suppliedData['explore.categories.'+i+'.times'] = newCategorytimes;
                                        }
                                    }
                                    console.log(suppliedData);
                                }
                            });

                        console.log(user);
                    }
                });

    } else {
        response.status = 400;
        response.message = {
            message: "Cannot update specific user detail as insufficient parameters have been supplied!"
        };
    }

    setTimeout(() => {
        if(response.status != 200) {
            res
                .status(response.status)
                .json(response.message);
        } else {
            User
                .update({
                    "_id": req.user._id
                }, suppliedData, function(err, updatedUser) {
                    if(err) {
                        res
                            .status(500)
                            .json({
                                err, 
                                message: "An error occured!"
                            });
                    } else {
                        res
                            .status(204)
                            .json();
                    } 
                });
        }
    }, 1000);
 
}

module.exports.getAllUserOrders = function(req, res) {
    console.log('get partial details of user orders');

    Event
        .find({
            'orders.buyer._id': req.user._id
        })
        .select('eventImage title startDate orders._id orders.createdOn orders.normalType orders.buyer._id')
        .exec(function(err, event) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding orders');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!event) {
                response.status = 404;
                response.message = {
                    message: 'User id not found!'
                }
            } else {
                 for(var i = 0; i < event.length; i++) {
                    for(var j = 0; j < event[i].orders.length; j++) {
                        if(event[i].orders[j].buyer._id !== req.user.id) {
                            event[i].orders = event[i].orders.splice(j);
                        }
                    }
                 }
                 response.message = event.length !== 0 ? event : { message: 'There are no tickets to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

module.exports.getAllUserEvents = function(req, res) {
    console.log('Get all user events');

    Event
        .find({
            'organizer.user_id': req.user._id
        })
        .select('title startDate endDate eventLink status settings.category location.address.state ticket.price ticket.normalType')
        .exec(function(err, event) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding events');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!event) {
                response.status = 404;
                response.message = {
                    message: 'User id not found!'
                }
            } else {
                 response.message = event.length !== 0 ? event : { message: 'There are no events to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

module.exports.getOneUserOrders = function(req, res) {
    console.log('Get a single event order');
    var eventId = req.params.id;
    var orderId = req.params.orderId;

    Event
        .findById(eventId)
        .select('title startDate endDate location.name location.address orders')
        .exec(function(err, event) {
            var orderInstance = {};
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding orders');
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
                orderInstance = event.orders.id(orderId);

                if(!orderInstance) {
                    response.status = 404;
                    response.message = {
                        message: 'Order not found, '+ orderId
                    }
                } else {
                    event.orders = orderInstance;
                    response.message = event ? event : { message: 'There are no ticket detail to display' };
                }
            } 

            res 
                .status(response.status)
                .json(response.message)
        });
}

module.exports.getOrderReviews = function(req, res) {
    console.log('GET all user reviews on events');
    var count = 10;
    var maxCount = 20;

    if(req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if(isNaN(count)) {
        res 
            .status(400)
            .json({
                message: 'Please make sure that the query string count is numeric'
            })
        return;
    }

    if(count > maxCount) {
        res 
            .status(400)
            .json({
                message: 'Count limit of '+maxCount+' exceeded!'
            })
        return;
    }

    Event
        .find({
            "reviews.reviewBy._id": req.user._id
        })
        .limit(count)
        .select('title startDate endDate location.name location.address reviews')
        .exec(function(err, events) {
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
            } else if(!events) {
                response.status = 404;
                response.message = {
                    message: 'User id not found!'
                }
            } else {
                for(var i = 0; i < events.length; i++) {
                    for(var j = 0; j < events[i].reviews.length; j++) {
                        if(events[i].reviews[j].reviewBy._id !== req.user.id) {
                            events[i].reviews = events[i].reviews.splice(j);
                        }
                    }
                 }
                 response.message = events.length !== 0 ? events : { message: 'There are no reviews to display' };
            }

            res 
                .status(response.status)
                .json(response.message)
        });
}

module.exports.userForgotPassword = function(req, res) {
    console.log('User restore password');

    if(!req.body.email) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    User
        .findOne({
            "email": req.body.email
        })
        .exec(function(err, user) {
            if(err) {
                res
                    .status(500)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else if(!user) {
                res
                    .status(404)
                    .json({
                        message: "Email not registered on our database!"
                    })
            } else {

                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*_$#";

                for (var i = 0; i < 10; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                var password = bcrypt.hashSync(text, bcrypt.genSaltSync(10));

                var suppliedData = {
                    password: password
                }
                //send email before updating it.
                User
                    .update({
                        "email": req.body.email
                    }, suppliedData, function(err, updatedUser) {
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

module.exports.userFeedback = function(req, res) {
    console.log('User feedback');

    if(!req.body.like || !req.body.rateLike || !req.body.hate || !req.body.rateHate ||
       !req.body.platformRating || !req.body.improvements) {

        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    Feedback
        .create({
            like: req.body.like,
            rateLike: req.body.rateLike,
            hate: req.body.hate,
            rateHate: req.body.rateHate,
            platformRating: req.body.platformRating,
            improvements: req.body.improvements,
            feedbackBy: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        }, function(err, feedback) {
            if(err) {
                res 
                    .status(400)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else {
                res
                    .status(201)
                    .json(feedback)
            }
        });
}

module.exports.authenticate = function(req, res, next) {
    var headerExists = req.headers.authorization;
    
    if(headerExists) {
        var token = req.headers.authorization.split(' ')[1]; //-> Authorization: Bearer vvv
        jwt.verify(token, db_config.secret, function(err, decoded) {
            if(err) {
                console.log(err);
                res
                    .status(401)
                    .json({
                        err, 
                        message: "Failed to authenticate!"
                    })
            } else {
                console.log('Authentication successfull');
                req.user = {
                    _id: decoded._id,
                    name: decoded.name.first+" "+decoded.name.last,
                    email: decoded.email
                };
                next();
            }
        });
    } else {
        res
            .status(403)
            .json({message: 'No token provided!'})
    }
}


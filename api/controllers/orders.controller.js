var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var mailCtrl = require('../../mailer/mail.controller.js');

module.exports.getAllOrders = function(req, res) {
    var eventId = req.params.id;
    console.log("GET event!", eventId);

    Event
        .findById(eventId)
        .select('orders')
        .exec(function(err, doc) {
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
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event id not found! '+ eventId
                }
            } else {
                 console.log('Found orders', doc.orders.length);
                 response.message = doc.orders.length !== 0 ? doc.orders : { message: 'There are no orders to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

var _addOrder = function(req, res, event) {
    event.orders.push({
        buyer: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        },
        ticketName: req.body.ticketName,
        ticketType: req.body.ticketType,
        normalType: req.body.normalType,
        status: req.body.status,
        noOfSeats: req.body.noOfSeats,
        cost: req.body.cost,
        transactionId: req.body.transactionId
    });

    event.save(function(err, orderAdded) {
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
                .json(orderAdded.orders[orderAdded.orders.length -1])
        }
    });
}

module.exports.orderAddOne = function(req, res) {
    var eventId = req.params.id;

    if(req.body.cost && req.body.cost < 0) {
        res 
            .status(400)
            .json({message: 'Cost cannot be less than 0 '})
        return;
    } else if(!req.body.cost && req.body.cost !== 0) {
        res 
            .status(400)
            .json({message: 'Please ensure the cost field is filled '})
        return;
    }

    if(!req.body.ticketName || !req.body.ticketType || !req.body.normalType ||
       !req.body.status || !req.body.noOfSeats || !req.body.transactionId) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    Event
        .findOne({
            eventLink: eventId
        })
        .select('orders')
        .exec(function(err, doc) {
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
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event id not found! '+ eventId
                }
            } 
            
            if(doc) {
                _addOrder(req, res, doc);
            } else {
                  res 
                    .status(response.status)
                    .json(response.message)
            }
           
        });
}

module.exports.sendEmail = function(req, res) {
    if(!req.body.to || !req.body.subject || !req.body.messageObj ||
       !req.body.template) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    mailCtrl.sendMail(req.body.to, req.body.subject, req.body.messageObj, req.body.template, (err, info) => {
        if(err) {
            res
                .status(421)
                .json({message: 'Email failed to send '});
        } else {
            res
                .status(200)
                .json({message: 'Email successfully sent!'});
        }
    });
    
}

module.exports.sendEmailWithAttach = function(req, res) {
    if(!req.body.to || !req.body.subject || !req.body.messageObj ||
       !req.body.template || !req.body.attach) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    mailCtrl.sendMailWithAttach(req.body.to, req.body.subject, req.body.messageObj, req.body.attach, req.body.template, (err, info) => {
        if(err) {
            res
                .status(421)
                .json({message: 'Email failed to send '});
        } else {
            res
                .status(200)
                .json({message: 'Email successfully sent!'});
        }
    });
    
}

module.exports.createHtmlPdf = function(req, res) {
    if(!req.body.bodyObj || !req.body.template) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    mailCtrl.createHtmlPdf(req.body.bodyObj, req.body.template, (err, info) => {
        if(err) {
            res
                .status(421)
                .json({message: 'Failed to create ticket'});
        } else {
            res
                .status(201)
                .json({message: 'Ticket successfully created!'});
        }
    });
    
}
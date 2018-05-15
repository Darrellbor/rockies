var mongoose = require('mongoose');
var Event = mongoose.model('Event');

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
                 response.message = doc.orders ? doc.orders : [];
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

    if(!req.body.ticketName || !req.body.ticketType || !req.body.normalType ||
       !req.body.status || !req.body.noOfSeats || !req.body.cost || !req.body.transactionId) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

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
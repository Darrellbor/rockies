var mongoose = require('mongoose');
var Event = mongoose.model('Event');

var runGeoQuery = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if(isNaN(lng) || isNaN(lat)) {
        res 
            .status(400)
            .json({
                message: 'Please make sure that the query string lng and lat are numeric'
            })
        return;
    }

    //A geoJSON point 
    var point = {
        "type": "Point",
        "coordinates": [lng, lat]
    };

    var geoOptions = {
        "spherical": true,
        "maxDistance": 10000,
        "distanceField": 'dist.calculated',
        "includeLocs": "dist.location",
        "num": 6
    };

    Event
        .aggregate([{
            '$geoNear': {
                    "near": { "type": point.type, 
                    'coordinates': point.coordinates },
                    "spherical": geoOptions.spherical, 
                    "distanceField": geoOptions.distanceField, 
                    "maxDistance": geoOptions.maxDistance,
                    "includeLocs": geoOptions.includeLocs,
                    "num": geoOptions.num
            }
        }])
        .exec(function(err, results) {
            if (err) {
                res
                    .status(500)
                    .json(err);
            }
            if (results.length === 0) {
                console.log('No events within 10 km');
                res
                    .status(204)
                    .json();
            }
            else {
                //console.log('Geo results ', results);
                res
                    .status(200)
                    .json(results);
            }
        });
}

module.exports.getAllEvents = function(req, res) {
    var count = 6;
    var offset = 0;
    var sort = "-createdOn";
    var maxCount = 15;
    var filter = {};

    if(req.query && req.query.lng && req.query.lat) {
        runGeoQuery(req, res);
        return;
    }

    if(req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if(req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if(req.query && req.query.sort) {
        sort = req.query.sort;
    }

    if(req.body && req.body.filter) {
        filter = req.body.filter; 
    }

    if(isNaN(offset) || isNaN(count)) {
        res 
            .status(400)
            .json({
                message: 'Please make sure that the query string offset and count are numeric'
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
        .find(filter)
        .skip(offset)
        .limit(count)
        .sort(sort)
        .exec(function(err, events) {
            if(err) {
                console.log('Error finding events');
                res
                    .status(500)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else {
                console.log('Found events', events.length);
                res
                    .status(200)
                    .json(events)
            }
        });
}

var _splitArray = function(input) {
    var output;
    if(input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
}

module.exports.eventsAddOne = function(req, res) {

    if(!req.body.title || !req.body.description || !req.body.startDate ||
       !req.body.endDate || !req.body.location || !req.body.organizer ||
       !req.body.ticket || !req.body.settings) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    //Obtaining the event link
    var linkTitle = req.body.title.split(" ");
    linkTitle = linkTitle.join("-");
    var uniqueKey = "";
    var count = 0;
    while(count < 8) {
    	var randNum = (Math.floor(Math.random() * 100) + 1);
        uniqueKey += randNum;
        count += 1;
    }

    linkTitle = linkTitle + "-" + uniqueKey;
    eventTitle = "https://rockies.ng/e/" + linkTitle;
 
    
    Event
        .create({
            title: req.body.title,
            description: req.body.description,
            eventImage: req.body.eventImage, //handle as a fileupload
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            location: req.body.location,    //expecting an object
            eventLink: eventTitle,
            totalViewed: 0,
            organizer: req.body.organizer,  //expecting an object
            ticket: req.body.ticket,      //expecting an object or array
            settings: req.body.settings     //expecting an object
        }, function(err, event) {
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
                    .json(event)
            }
        });
}

module.exports.eventsGetOne = function(req, res) {
    var eventId = req.params.id;
    console.log("GET event ", eventId);

    Event
        .findById(eventId)
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: doc
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event id not found! '+blogId
                }
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

module.exports.checkEventTitle = function(req, res) {
    var title = "";
    var query = {};

    if(req.query && req.query.title && req.query.for === "eventLink") {
        title = req.query.title;
        query = { eventLink: title };
    } else if(req.query && req.query.title && req.query.for === "organizerUrl") {
        title = req.query.title;
        query = { "organizer.url": title };
    }

    Event
        .findOne(query)
        .exec(function(err, event) {
            if(err) {
                console.log('Error finding events');
                res
                    .status(500)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else {
                res
                    .status(200)
                    .json(event)
            }
        });
}

module.exports.eventsUpdateAll = function(req, res) {
    var eventId = req.params.id;
    console.log("GET event ", eventId);

    Event
        .findById(eventId)
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: doc
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event id not found! '+blogId
                }
            }

            if(response.status !== 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {

                var suppliedData = {
                    description: req.body.description,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    location: req.body.location,    //expecting an object
                    eventLink: req.body.eventLink,
                    organizer: req.body.organizer,  //expecting an object
                    ticket: req.body.ticket,      //expecting an object or array
                    settings: req.body.settings 
                }

                if(!req.body.description || !req.body.startDate ||
                   !req.body.endDate || !req.body.location || !req.body.eventLink || 
                   !req.body.organizer || !req.body.ticket || !req.body.settings) {
                        res 
                            .status(400)
                            .json({message: 'Please ensure all fields are filled '})
                        return;
                }

                Event
                    .update({
                        _id: eventId
                    }, suppliedData, function(err, updatedEvent) {
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

module.exports.eventsUpdateOne = function(req, res) {
    var eventId = req.params.id;
    console.log("GET event ", eventId);

    Event
        .findById(eventId)
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: doc
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Event id not found! '+blogId
                }
            }

            if(response.status !== 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {

                if(req.body.viewed && isNaN(req.body.viewed)) {
                    res 
                        .status(400)
                        .json({
                            message: "Please make sure that viewed is a numerical value"
                        })
                    return;
                } else if(req.body.tickets && isNaN(req.body.tickets)) {
                    res 
                        .status(400)
                        .json({
                            message: "Please make sure that tickets is a numerical value"
                        })
                    return;
                }

                //for updating totalViewed
                var updateViewed = doc.totalViewed + parseInt(req.body.viewed, 10);

                doc.totalViewed = updateViewed;

                //for updating tickets
                var updateTicketQuantity = doc.ticket[0].quantity;

                if((req.body && req.body.tickets && !req.body.type && !req.body.operation) || 
                   (req.body && !req.body.tickets && req.body.type && !req.body.operation) ||
                   (req.body && !req.body.tickets && !req.body.type && req.body.operation) ||
                   (req.body && req.body.tickets && req.body.type && !req.body.operation)  ||
                   (req.body && req.body.tickets && !req.body.type && req.body.operation)  ||
                   (req.body && !req.body.tickets && req.body.type && req.body.operation)) {
                    res 
                        .status(400)
                        .json({
                            message: "Please make sure that (type,tickets and operation) pair fields are available in order to patch quantity of tickets"
                        })
                    return;
                } else if(req.body.type === "Normal" && req.body.operation === "Sub") {
                    updateTicketQuantity = doc.ticket[0].quantity - parseInt(req.body.tickets, 10);

                    doc.ticket[0].quantity = updateTicketQuantity;
                    
                } else if(req.body.type === "Normal" && req.body.operation === "Add") {
                    updateTicketQuantity = doc.ticket[0].quantity + parseInt(req.body.tickets, 10);

                    doc.ticket[0].quantity = updateTicketQuantity;
                    
                } else if(req.body.type === "Vip" && req.body.operation === "Sub") {
                    updateTicketQuantity = doc.ticket[1].quantity - parseInt(req.body.tickets, 10);
                    
                    doc.ticket[1].quantity = updateTicketQuantity;

                } else if(req.body.type === "Vip" && req.body.operation === "Add") {
                    updateTicketQuantity = doc.ticket[1].quantity + parseInt(req.body.tickets, 10);
                    
                    doc.ticket[1].quantity = updateTicketQuantity;
                }

                if(req.body && req.body.viewed) {
                    if(req.user._id === doc.organizer.user_id) {
                        res 
                            .status(200)
                            .json({
                                message: "Skip"
                            })
                        return;
                    }
                    
                    
                } //handle the eventImage file in an else if block

                Event
                    .update({
                        _id: eventId
                    }, doc, function(err, updatedEvent) {
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

module.exports.eventsDeleteOne = function(req, res) {
    var eventId = req.params.id;

    Event    
        .findByIdAndRemove(eventId)
        .exec(function(err, event) {
            if(err) {
                res
                    .status(404)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else {
                console.log('Event deleted ', eventId);
                res
                    .status(204)
                    .json()
            }
        });
}

module.exports.organizerGetEvents = function(req, res) {
    organizerId = req.params.id;

    Event
        .find({
            "organizer._id": organizerId,
            "startDate": { $gt: new Date() }
        })
        .sort("-createdOn")
        .exec(function(err, events) {
            var response = {
                status: 200,
                message: events
            }
            if(err) {
                console.log('Error finding events');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!events) {
                response.status = 404;
                response.message = {
                    message: 'Organizer id not found! '+organizerId
                }
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var User = mongoose.model('User');

module.exports.getAllOrganizers = function(req, res) {
    console.log('get all user organizers');

    User
        .findOne({
            "_id": req.user._id
        })
        .select("organizerProfiles._id organizerProfiles.name organizerProfiles.url organizerProfiles.email organizerProfiles.createdOn")
        .exec(function(err, user) {
            var response = {
                status: 200,
                message: user
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!user) {
                response.status = 404;
                response.message = {
                    message: 'User id not found! '
                }
            } else {
                response.message = user.organizerProfiles.length !== 0 ? user.organizerProfiles : { message: 'There are no profiles to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

var _addOrganizerProfile = function(req, res, user) {

    //Obtaining the organizer url
    var organizerName = req.body.name.split(" ");
    organizerName = organizerName.join("-");
    var uniqueKey = "";
    var count = 0;
    while(count < 8) {
    	var randNum = (Math.floor(Math.random() * 100) + 1);
        uniqueKey += randNum;
        count += 1;
    }

    organizerName = organizerName + "-" + uniqueKey;
    logoTitle = organizerName + "" + uniqueKey;
    //url = "https://rockies.ng/o/" + organizerName;
    url = organizerName;

    //handling uploaded organizer logo
    var organizerLogo = req.files.organizerLogo;
 
    // Use the mv() method to place the file somewhere on your server
    organizerLogo.mv('../../assets/images/organizers/'+logoTitle+'.jpg', function(err) {
        if (err) {
            res
                .status(500)
                .send({
                    err,
                    message: 'An error occured uploading organizer logo'
                });
            return;
        }
    
        console.log('File uploaded!', organizerLogo);
    });

    user.organizerProfiles.push({
        user_id: req.user._id,
        name: req.body.name,
        about: req.body.about,
        phone: req.body.phone,
        email: req.body.email,
        socials: req.body.socials,
        background_color: req.body.background_color,
        text_color: req.body.text_color,
        url: url,
        logo: logoTitle     //handle as file upload
    });

    user.save(function(err, organizerProfilesAdded) {
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
                .json(organizerProfilesAdded.organizerProfiles[organizerProfilesAdded.organizerProfiles.length -1])
        }
    });
}

module.exports.addOneOrganizer = function(req, res) {
    console.log('add a new user organizer profile');

    if(!req.body.name || !req.body.about || !req.body.phone || !req.body.email ||
       !req.body.socials || !req.body.background_color || !req.body.text_color) {
           res 
                .status(400)
                .json({message: 'Please ensure all fields are filled '})
           return;
    }

    if (!req.files) {
        res
            .status(400)
            .json({ message: 'No files were uploaded.' });
        return;
    }

    User
        .findOne({
            "_id": req.user._id
        })
        .select("organizerProfiles")
        .exec(function(err, user) {
            var response = {
                status: 200,
                message: user
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!user) {
                response.status = 404;
                response.message = {
                    message: 'User id not found! '
                }
            } 

            if(response.status !== 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {
                _addOrganizerProfile(req, res, user);
            }
        });
}

module.exports.getOneOrganizer = function(req, res) {
    console.log('Get one user organizer profile');
    var organizerUrl = req.params.id;
    var organizer = {};

    var response = {
            status: 200,
            message: {}
        }

    User
        .findOne({
            "organizerProfiles.url": organizerUrl
        })
        .select("organizerProfiles")
        .exec(function(err, user) {
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };

                res 
                    .status(response.status)
                    .json(response.message)
            } else if(!user) {
                response.status = 404;
                response.message = {
                    message: 'User id not found! '
                }

                res 
                    .status(response.status)
                    .json(response.message)
            } else {
                organizer['profile'] = user.organizerProfiles.length !== 0 ? user.organizerProfiles : { message: 'There are no profiles to display' };
                response.message = organizer;

                Event
                    .find({
                        "organizer.url": organizerUrl,
                        "startDate": { $gte: new Date() }
                    })
                    .sort("startDate")
                    .exec(function(err, events) {
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
                                message: 'Organizer url not found! '+organizerUrl
                            }
                        } else {
                            organizer['recentEvents'] = events.length !== 0 ? events : { message: 'There are no recent events to display' }
                            response.message = organizer;

                            Event
                                .find({
                                    "organizer.url": organizerUrl,
                                    "endDate": { $lt: new Date() }
                                })
                                .sort("startDate")
                                .exec(function(err, events) {
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
                                            message: 'Organizer url not found! '+organizerUrl
                                        }
                                    } else {
                                        organizer['pastEvents'] = events.length !== 0 ? events : { message: 'There are no past events to display' }
                                        response.message = organizer;
                                    }
                                    
                                    res 
                                        .status(response.status)
                                        .json(response.message)
                                });
                        }
                    });
            }
        });

}

module.exports.updateAllOrganizer = function(req, res) {
    console.log('update one user organizer');

    var organizerId = req.params.id;

    User
        .findOne({
            "organizerProfiles._id": organizerId
        })
        .select("organizerProfiles")
        .exec(function(err, user) {
            var response = {
                status: 200,
                message: user
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!user) {
                response.status = 404;
                response.message = {
                    message: 'User id not found! '
                }
            } 

            if(response.status != 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {
                var organizerInstance = user.organizerProfiles.id(organizerId);

                if(!req.body.name || !req.body.about || !req.body.phone || !req.body.email ||
                   !req.body.socials || !req.body.background_color || !req.body.text_color || !req.body.url) {
                        res 
                            .status(400)
                            .json({message: 'Please ensure all fields are filled '})
                        return;
                }

                organizerInstance.name = req.body.name;
                organizerInstance.about = req.body.about;
                organizerInstance.phone = req.body.phone;
                organizerInstance.email = req.body.email,
                organizerInstance.socials = req.body.socials;
                organizerInstance.background_color = req.body.background_color;
                organizerInstance.text_color = req.body.text_color;
                organizerInstance.url = req.body.url;

                user.save(function(err, organizerProfileUpdated) {
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

module.exports.updateOneOrganizer = function(req, res) {
    console.log('update a single organizer detail');

    if (req.body.type === "logoImage" && !req.files) {
        res
            .status(400)
            .json({ message: 'No files were uploaded.' });
        return;
    } else {
        var organizerId = req.params.id;

        User
            .findOne({
                "organizerProfiles._id": organizerId
            })
            .select("organizerProfiles")
            .exec(function(err, user) {
                var response = {
                    status: 200,
                    message: user
                }
                if(err) {
                    console.log('Error finding event');
                    response.status = 500;
                    response.message = {
                        err, 
                        message: "An error occured!"
                    };
                } else if(!user) {
                    response.status = 404;
                    response.message = {
                        message: 'User id not found! '
                    }
                } 

                if(response.status != 200) {
                    res 
                        .status(response.status)
                        .json(response.message)
                } else {
                    var organizerInstance = user.organizerProfiles.id(organizerId);

                    //handling uploaded organizer logo
                    var organizerLogo = req.files.organizerLogo;
                
                    // Use the mv() method to place the file somewhere on your server
                    organizerLogo.mv('../../assets/images/organizers/'+organizerLogo.name, function(err) {
                        if (err) {
                            res
                                .status(500)
                                .send({
                                    err,
                                    message: 'An error occured uploading organizer logo'
                                });
                            return;
                        }
                    
                        console.log('File uploaded!', organizerLogo);
                    });

                    user.save(function(err, organizerProfileUpdated) {
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
}

module.exports.deleteOneOrganizer = function(req, res) {
    console.log('delete one user organizer');

    var organizerId = req.params.id;

    User
        .findOne({
            "organizerProfiles._id": organizerId
        })
        .select("organizerProfiles")
        .exec(function(err, user) {
            var response = {
                status: 200,
                message: user
            }
            if(err) {
                console.log('Error finding event');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!user) {
                response.status = 404;
                response.message = {
                    message: 'User id not found! '
                }
            } 

            if(response.status != 200) {
                res 
                    .status(response.status)
                    .json(response.message)
            } else {
                var organizerInstance = user.organizerProfiles.id(organizerId).remove();

                user.save(function(err, organizerProfileUpdated) {
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
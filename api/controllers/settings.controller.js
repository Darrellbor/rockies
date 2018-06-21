var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');
var Location = mongoose.model('Location');

module.exports.getAllCategories = function(req, res) {
    var SettingsId = "5afdeae7ef24054494492ef5";

    Settings
        .findById(SettingsId)
        .select('categories')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding categories');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Settings id not found! '+ SettingsId
                }
            } else {
                 console.log('Found categories', doc.categories.length);
                 response.message = doc.categories.length !== 0 ? doc.categories : { message: 'There are no categories to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

var _addCategory = function(req, res, settings) {
    settings.categories.push({
        by: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        },
        name: req.body.name
    });

    settings.save(function(err, categoryAdded) {
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
                .json(categoryAdded.categories[categoryAdded.categories.length -1])
        }
    });
}

module.exports.categoriesAddOne = function(req, res) {
     var SettingsId = "5afdeae7ef24054494492ef5";

     if(!req.body.name) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    Settings
        .findById(SettingsId)
        .select('categories')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error adding categories');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Settings id not found! '+ SettingsId
                }
            } 

            if(doc) {
                _addCategory(req, res, doc);
            } else {
                  res 
                    .status(response.status)
                    .json(response.message)
            }
        });
}

module.exports.getAllLocations = function(req, res) {
    var SettingsId = "5afdeae7ef24054494492ef5";
    Settings
        .findById(SettingsId)
        .select('locations')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error finding locations');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Settings id not found! '+ SettingsId
                }
            } else {
                 console.log('Found locations', doc.locations.length);
                 response.message = doc.locations.length !== 0 ? doc.locations : { message: 'There are no loactions to display' };
            }
            res 
                .status(response.status)
                .json(response.message)
        });
}

var _addLocations = function(req, res, settings) {
    settings.locations.push({
        by: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        },
        name: req.body.name,
        address: req.body.address,
        coordinates: req.body.coordinates
    });

    settings.save(function(err, locationsAdded) {
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
                .json(locationsAdded.locations[locationsAdded.locations.length -1])
        }
    });
}

module.exports.locationsAddOne = function(req, res) {
    var SettingsId = "5afdeae7ef24054494492ef5";

     if(!req.body.name || !req.body.address || !req.body.coordinates) {
        res 
            .status(400)
            .json({message: 'Please ensure all fields are filled '})
        return;
    }

    Settings
        .findById(SettingsId)
        .select('locations')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            }
            if(err) {
                console.log('Error adding locations');
                response.status = 500;
                response.message = {
                    err, 
                    message: "An error occured!"
                };
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    message: 'Settings id not found! '+ SettingsId
                }
            } 

            if(doc) {
                _addLocations(req, res, doc);
            } else {
                  res 
                    .status(response.status)
                    .json(response.message)
            }
        });
}

module.exports.getLocations = function(req, res) {
    var count = 5;
    var maxCount = 10;
    var city = "";

    if(req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if(req.query && req.query.city) {
        city = req.query.city; 
        var splitCity = city.split("");
        splitCity[0] = splitCity[0].toUpperCase();
        city = splitCity.join("");
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

    Location
        .find(
            { "states": { "$regex": city } }, 
            { "states.$": 1 }
        )
        .limit(count)
        .select("states country")
        .exec(function(err, locations) {
            if(err) {
                console.log('Error finding locations');
                res
                    .status(500)
                    .json({
                        err, 
                        message: "An error occured!"
                    })
            } else {
                console.log('Found locations', locations.length);
                res
                    .status(200)
                    .json(locations)
            }
        });
}
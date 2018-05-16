var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

module.exports.getAllCategories = function(req, res) {
    var SettingsId = "5afc9fbdef24054494492ef4";
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
                 response.message = doc.categories ? doc.categories : [];
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
     var SettingsId = "5afc9fbdef24054494492ef4";

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
    var SettingsId = "5afc9fbdef24054494492ef4";
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
                 response.message = doc.locations ? doc.locations : [];
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
    var SettingsId = "5afc9fbdef24054494492ef4";

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
var express = require('express');
var router = express.Router();

var settingsCtrl = require('../controllers/settings.controller.js');
var usersCtrl = require('../controllers/users.controller.js');

router  
    .route('/settings/categories')
    .get(settingsCtrl.getAllCategories)
    .post(usersCtrl.authenticate, settingsCtrl.categoriesAddOne);

router  
    .route('/settings/locations')
    .get(settingsCtrl.getAllLocations)
    .post(usersCtrl.authenticate, settingsCtrl.locationsAddOne);

router  
    .route('/locations')
    .get(settingsCtrl.getLocations);

module.exports = router;
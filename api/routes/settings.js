var express = require('express');
var router = express.Router();

var settingsCtrl = require('../controllers/settings.controller.js');

router  
    .route('/settings/categories')
    .get(settingsCtrl.getAllCategories)
    .post(settingsCtrl.categoriesAddOne);

router  
    .route('/settings/locations')
    .get(settingsCtrl.getAllLocations)
    .post(settingsCtrl.locationsAddOne);

module.exports = router;
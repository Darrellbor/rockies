var mongoose = require('mongoose');

var settingsSchema = new mongoose.Schema({
    country: String,
    states: [String],
});

mongoose.model('Location', settingsSchema, 'locations');
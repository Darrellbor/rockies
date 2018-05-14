var mongoose = require('mongoose');

var settingsSchema = new mongoose.Schema({
    categories: [{
        name: {
            type: String,
            required: [true, "Category name cannot be empty!"]
        },
        by: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "User id cannot be empty!"]
            },
            name: String,
            email: String
        },
        createdOn: {
            type: Date,
            default: Date.now
        }
    }],
    locations: [{
        name: {
            type: String,
            required: [true, "Location name cannot be empty!"]
        },
        address: {
            street: {
                type: String,
                required: [true, "street name cannot be empty!"]
            },
            cityOrProvince: String,
            state: String,
            zipCode: Number,
            country: String
        },
        //Always store coordinates as longitude (E/W) and latitude (N/S)
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        by: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "User id cannot be empty!"]
            },
            name: String,
            email: String
        },
        createdOn: {
            type: Date,
            default: Date.now
        }
    }]
});

mongoose.model('Settings', settingsSchema, 'settings');
var mongoose = require('mongoose');

var validateEmail = {
    validator: function(email) {
        return /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(email);
    },
    message: '{VALUE} is not a valid email address!'
}

var organizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Organizer name cannot be empty!"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id cannot be empty!"]
    },
    about: String,
    url: String,
    phone: Number,
    email: String,
    socials: {
        facebook: String,
        twitter: String,
        instagram: String,
        website: String,
        blog: String
    },
    logo: String,
    background_color: String,
    text_color: String,
    createdOn: {
        type: Date,
        default: Date.now
    }
});

var userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: [true, "First name cannot be empty!"],
            trim: true
        },
        last: {
            type: String,
            required: [true, "Last name cannot be empty!"],
            trim: true
        }
    },
    email: {
        type: String,
        required: [true, "Email cannot be empty!"],
        unique: true,
        lowercase:true,
        validate: validateEmail
    },
    password: {
        type: String,
        required: [true, "Password cannot be empty!"]
    },
    confirmed: {        //accepts only a yes or no
        type: String,
        trim: true,
        default: "No"
    },
    explore: {
        categories: [{
            name: String,
            times: Number
        }],
        incompleteEventOrders: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "Event id cannot be empty!"]
            },
            title: String,
            eventLink: String,
            startDate: Date,
            eventImage: String,
            category: String,
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
            cost: Number
        }]
    },
    organizerProfiles: [organizerSchema],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', userSchema);
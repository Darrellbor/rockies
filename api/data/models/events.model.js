var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    ticketName: {
        type: String,
        required: [true, "Ticket name cannot be empty!"]
    },
    ticketType: {       //accepts only a vip or normal
        type: String,
        required: [true, "Ticket type cannot be empty!"],
        trim: true
    },
    normalType: {       //accepts only a free or paid
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: [true, "Ticket status cannot be empty!"],
        trim: true
    },
    noOfSeats: {
        type: Number,
        min: 1,
        default: 1
    },
    cost: Number,
    transactionId: String,
    buyer: {
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
});

var reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty!"]
    },
    sentimentRating: Number,
    reviewBy: {
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
});

var eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Event title cannot be empty!"]
    },
    description: {
        type: String,
        required: [true, "Event description cannot be empty!"]
    },
    eventImage: {       //accepts an image url
        type: String,
        required: [true, "Event image cannot be empty!"]
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    location: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Location id cannot be empty!"]
        },
        name: String,
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
        showMap: {         //accepts a yes or no
            type: String,
            required: [true, "Show map cannot be empty!"],
            trim: true
        }    
    },
    eventLink: String,
    totalViewed: Number,
    organizer: {
        _id:  {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Organizer id cannot be empty!"]
        },
        name: String,
        about: String,
        phone: Number,
        email: String,
        facebook: String,
        twitter: String,
        instagram: String,
        logo: String,        //accepts an image url
        url: String
    },
    ticket: [{
        name: {
            type: String,
            required: [true, "Ticket name cannot be empty!"]
        },
        type: {             //accepts a normal or VIP
            type: String,
            required: [true, "Ticket type cannot be empty!"],
            trim: true
        },
        normalType: String,  //accepts a free or paid
        description: String,
        quantity: {
            type: Number,
            required: [true, "Ticket quantity cannot be empty!"],
        },
        price: Number,
        ticketSaleStarts: {
            type: Date,
            default: Date.now
        },
        ticketSaleEnds: {
            type: Date,
            default: Date.now
        },
        maxTicketPerPerson: {
            type: Number,
            min: 1,
            max: 10,
            default: 1
        },
        showTicket: {        //accepts a yes or no
            type: String,
            trim: true,
            default: "No"
        }     
    }],
    settings: {
        category: {         
            type: String,
            required: [true, "Category cannot be empty!"],
            trim: true
        },
        reservationLimit: {         
            type: String,
            required: [true, "Reservation number cannot be empty!"],
            trim: true
        },
        showVipRemaining: {         //accepts a yes or no
            type: String,
            required: [true, "Show vip remaining cannot be empty!"],
            trim: true
        },
        showNormalRemaining: {         //accepts a yes or no
            type: String,
            required: [true, "Show normal remaining cannot be empty!"],
            trim: true
        }
    },
    orders: [orderSchema],
    reviews: [reviewSchema],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Event', eventSchema);
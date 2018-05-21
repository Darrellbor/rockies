var mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
    like: String,
    rateLike: Number,
    hate: String,
    rateHate: Number,
    platformRating: Number,
    improvements: String,
    feedbackBy: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        email: String
    }
});

mongoose.model('Feedback', feedbackSchema);
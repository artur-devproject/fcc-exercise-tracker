var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var exerciseSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

// Format date
exerciseSchema.virtual('date_formatted').get(function() {return moment(this.date).format('ddd MMM DD YYYY');});

// Export model
module.exports = mongoose.model('exercises', exerciseSchema);
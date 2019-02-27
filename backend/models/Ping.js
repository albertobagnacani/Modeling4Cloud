const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

let Schema = mongoose.Schema;

var PingSchema = new Schema({
    provider: String,
    from_zone: String,
    to_zone: String,
    from_host: String,
    to_host: String,
    icmp_seq: Number,
    ttl: Number,
    time: Number,
    timestamp: { type : Date, default: Date.now }
}).plugin(mongoosePaginate);

const Ping = mongoose.model('Ping', PingSchema);

module.exports = Ping;
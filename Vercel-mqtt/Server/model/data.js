const mongoose = require('mongoose');

const format_data = new mongoose.Schema({
    waktu: String,
    nilai: Array
});

const data_value = mongoose.model("data_value", format_data, "mqtt_collection");

module.exports = { data_value };
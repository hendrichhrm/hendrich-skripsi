const mongoose = require('mongoose');

const format_data = new mongoose.Schema({
    waktu: String,
    nilai: Object
});

const data_value = mongoose.model("data_value", format_data, "data-drywell");

module.exports = { data_value };
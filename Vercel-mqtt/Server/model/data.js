const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    waktu: { type: String, required: true },
    nilai: [{
        Temperature: { type: String, required: true },
        Unit: { type: String, required: true },
        Setpoint: { type: String, required: true },
        Sampling: { type: String, required: true },
        DutyCycle: { type: String, required: true }
    }]
});

const DataValue = mongoose.model('DataValue', DataSchema, 'data-drywell');

module.exports = { DataValue };

const mongoose = require('mongoose');

const ContractsSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.validFrom;
            },
            message: 'End date must be later than start date'
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('Contract', ContractsSchema);

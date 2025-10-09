const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: {type: String, required: true},
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {type: String, required: true},
    phone: {type: String, required: true},
    cin: {type: String, required: true},
    role: { type: String, enum: [ "Particulier", "Admin" ], default: "Particulier" },

    kycStatus: { type: String, enum: ["panding", "verified", "rejected"], default: "panding" },
    nationalIdImage: { type: String, required: true },
    selfieImage: { type: String, required: true },

    punctualityScore: { type: Number, default: 0 },

    groups: [{
        type: ObjectId,
        ref: 'Group'
    }]
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User;
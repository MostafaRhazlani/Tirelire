const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new mongoose.Schema({
    groupName: String,
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["owner", "member"], default: "member" },
        joinTimeScore: Number, // score at time of joining
        joinDate: Date
    }],
    rules: {
        contributionAmount: Number,
        contributionFrequency: { type: String, enum: ["weekly", "monthly"], default: "weekly" },
        deadlineDays: Number
    },
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;


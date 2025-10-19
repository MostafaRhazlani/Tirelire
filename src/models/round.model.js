const mongoose = require('mongoose');
const { Schema } = mongoose;

const contributionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'late'], default: 'pending' },
    paidAt: { type: Date }
}, { _id: false });

const contributionRoundSchema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    roundNumber: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    beneficiary: { type: Schema.Types.ObjectId, ref: 'User' },
    contributions: [contributionSchema],
    totalCollected: { type: Number, default: 0 },
    distributed: { type: Boolean, default: false }
}, { timestamps: true });

const ContributionRound = mongoose.model('ContributionRound', contributionRoundSchema);

module.exports = ContributionRound;



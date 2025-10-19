const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    roundId: { type: Schema.Types.ObjectId, ref: "ContributionRound" },
    amount: Number,
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: String,
    createdAt: Date,
    updatedAt: Date
}, { timeseries: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;



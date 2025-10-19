const Stripe = require('stripe');
const Payment = require('../models/payment.model');
const Group = require('../models/group.model');
const ContributionRound = require('../models/round.model');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
    async createPayment(userId, groupId, roundId, amount) {

        const group = await Group.findById(groupId);
        if (!group) throw new Error('Group not found');
        
        const contributionRound = await ContributionRound.findById(roundId);
        if(!contributionRound) throw new Error('Contribution round not found'); 

        // Check if user is a member
        const isMember = group.members.some((m) => m.userId.toString() === userId);
        if (!isMember) throw new Error('User is not a member of this group');

        // Check if a member is a contributor or not
        const isContributor = contributionRound.contributions.some((c) => c.userId.toString() === userId);
        
        if (isContributor) throw new Error('User has already contributed');

        const amountInCents = amount * 100;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'mad',
            automatic_payment_methods: { enabled: true }
        })

        contributionRound.totalCollected += amountInCents / 100;
        contributionRound.contributions.push({
            userId,
            amount,
            status: "pending",
            paidAt: new Date()
        })
        await contributionRound.save();

        const payment = await Payment.create({
            userId,
            groupId,
            roundId,
            amount,
            status: "pending",
            transactionId: paymentIntent.id
        });

        return {
            contributionRound,
            payment,
            clientSecret: paymentIntent.client_secret
        }
    }
}

module.exports = new PaymentService;
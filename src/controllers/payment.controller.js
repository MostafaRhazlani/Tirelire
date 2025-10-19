const PaymentService = require('../services/payment.service');

class PaymentController {

    async createPayment(req, res) {
        try {
            const { groupId, roundId, amount } = req.body;
            const userId = req.user.id;
            const result = await PaymentService.createPayment(userId, groupId, roundId, amount);
            res.status(200).json({
                status: "success",
                contributionRound: result.contributionRound,
                payment: result.payment,
                clientSecret: result.clientSecret
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}

module.exports = new PaymentController();

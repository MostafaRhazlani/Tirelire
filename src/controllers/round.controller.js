const RoundServices = require('../services/round.services');

class RoundController {
    async createNextRound(req, res) {
        try {
            
            const nextRound = await RoundServices.createNextRound(req.params.groupId);

            res.status(200).json({
                message: 'Next round is start',
                nextRound
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new RoundController;
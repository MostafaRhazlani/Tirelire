const ContributionRound = require('../models/round.model');
const Group = require('../models/group.model');
const User = require('../models/user.model');

class RoundServices {
    async createInitialRound(groupId) {
        try {
            const group = await Group.findById(groupId).populate('members.userId', 'full_name punctualityScore');
            if (!group) {
                throw new Error('Group not found');
            }

            const startDate = new Date();
            const endDate = this.calculateEndDate(group.rules.contributionFrequency, startDate);

            const sortedMembers = group.members.sort((a,b) => b.userId.punctualityScore - a.userId.punctualityScore);
            
            // Create the first round for the group
            const initialRound = await ContributionRound.create({
                groupId: groupId,
                roundNumber: 1,
                startDate,
                endDate,
                beneficiary: sortedMembers[0].userId._id.toString(),
                contributions: [],
                totalCollected: 0,
                distributed: false
            });

            return initialRound;
        } catch (error) {
            throw new Error('Failed to create initial round: ' + error.message);
        }
    }

    calculateEndDate(frequency, fromDate = new Date()) {
        const endDate = new Date(fromDate);
        
        if (frequency === 'weekly') {
            endDate.setDate(endDate.getDate() + 7);
        } else if (frequency === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        
        return endDate;
    }

    async createNextRound(groupId) {
        const group = await Group.findById(groupId).populate('members.userId', 'full_name punctualityScore');
        if (!group) throw new Error('Group not found');

        // Find the latest round (by roundNumber) that was distributed
        const lastRound = await ContributionRound.findOne({ groupId }).sort({ roundNumber: -1 });

        if(lastRound && lastRound.distributed === false) {
            throw new Error('You can\'t create new round for now');
        }

        // get all rounds
        const allRounds = await ContributionRound.find({ groupId }).sort({ roundNumber: 1 });

        const sortedMembers = group.members.sort((a,b) => b.userId.punctualityScore - a.userId.punctualityScore);

        // get all previous beneficiaries
        const previousBeneficiaries = allRounds.map(r => r.beneficiary?.toString());

        let nextBeneficiary = sortedMembers.find(m => !previousBeneficiaries.includes(m.userId._id.toString()));

        if(!nextBeneficiary) {
            if(allRounds.length > 1) {
                console.log('All members beneficiated');
                await ContributionRound.deleteMany({ groupId })
                return this.createInitialRound(groupId);
            }
        }

        const roundNumber = lastRound ? lastRound.roundNumber + 1 : 1;
        const startDate = lastRound ? lastRound.endDate : new Date();
        const endDate = this.calculateEndDate(group.rules.contributionFrequency, startDate);
        
        const newRound = await ContributionRound.create({
            groupId: groupId,
            roundNumber,
            startDate,
            endDate,
            beneficiary: nextBeneficiary.userId._id.toString(),
            contributions: [],
            totalCollected: 0,
            distributed: false
        });

        return newRound;
    }
}

module.exports = new RoundServices();

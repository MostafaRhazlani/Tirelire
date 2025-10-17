const { default: mongoose } = require('mongoose');
const Group = require('../models/group.model');
const User = require('../models/user.model');
const path = require('path');
const fs = require('fs');

class GroupServices {
    async store(data) {
        try {
            return await Group.create(data);
        } catch (error) {
            throw new Error('Failed to create group: ' + error.message)
        }
    }

    async joinGroup(groupId, user, image) {
        try {
            const group = await Group.findById(groupId);
            if(!group) throw new Error('Group not found');
            
            // store selfie image in user document
            const getUser = await User.findById(user.id);
            getUser.selfieImage = image.filename;
            await getUser.save();

            const groupRole = user.id === group.owner.toString() ? 'owner' : 'member';
            group.members.push({
                userId: new mongoose.Types.ObjectId(user.id),
                role: groupRole,
                joinTimeScore: 0
            })
            await group.save();
            return group;
            
        } catch (error) {
            throw new Error('Failed to join group: ' + error.message)
        }
    }

    async leaveGroup(groupId, userId) {
        try {
            const group = await Group.findById(groupId);
            
            if (!group) throw new Error('Group not found');

            // Check if user is a member
            const isMember = group.members.some((m) => m.userId.toString() === userId);
            if (!isMember) throw new Error('User is not a member of this group');

            // Prevent the owner from leaving
            if (group.owner.toString() === userId) {
                throw new Error('Owner cannot leave the group. You can delete it instead.');
            }

            const user = await User.findById(userId);
            if(user && user.selfieImage) {

                // remove image from database and folder images
                const imagePath = path.join(__dirname, '../../public/images', user.selfieImage);
                if(fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

                user.selfieImage = null;
                await user.save();
            }

            // Remove user from members array
            group.members = group.members.filter((m) => m.userId === userId);
            await group.save();
            return group;

        } catch (error) {
            throw new Error('Failed to leave group: ' + error.message);
        }
    }

    async updateRules(groupId, userId, rulesData) {
        try {
            const group = await Group.findById(groupId);
            if (!group) throw new Error('Group not found');

            // Only owner can update rules
            if (group.owner.toString() !== userId) {
                throw new Error('Only the group owner can update the rules');
            }
            
            // Update rules fields
            group.rules.contributionAmount = rulesData.contributionAmount ?? group.rules.contributionAmount;
            group.rules.contributionFrequency = rulesData.contributionFrequency ?? group.rules.contributionFrequency;
            group.rules.deadlineDays = rulesData.deadlineDays ?? group.rules.deadlineDays;

            await group.save();

            return group;
        } catch (error) {
            throw new Error('Failed to update rules: ' + error.message);
        }
    }


}

module.exports = new GroupServices;
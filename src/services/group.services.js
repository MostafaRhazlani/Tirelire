const { default: mongoose } = require('mongoose');
const Group = require('../models/group.model');

class GroupServices {
    async store(data) {
        try {
            return await Group.create(data);
        } catch (error) {
            throw new Error('Failed to create group: ' + error.message)
        }
    }

    async joinGroup(groupId, user) {
        try {
            const group = await Group.findById(groupId);
            if(!group) throw new Error('Group not found');

            // prevent duplicate join
            const alreadeyMember = group.members.some((m) => m.userId.toString() === user.id);
            if(alreadeyMember) throw new Error('User already joined this group');

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

        // Remove user from members array
        group.members = group.members.filter((m) => m.userId.toString() !== userId);
        await group.save();
        return group;

    } catch (error) {
        throw new Error('Failed to leave group: ' + error.message);
    }
}

}

module.exports = new GroupServices;
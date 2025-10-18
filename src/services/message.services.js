const Message = require('../models/message.model');
const Group = require('../models/group.model');

class MessageService {
    async createMessage(groupId, senderId, payload) {
        
        const group = await Group.findById(groupId);
        if(!group) throw new Error('Group not found');

        const isMember = group.members.some(m => m.userId.toString() === senderId);
        if(!isMember) throw new Error('You are not a member of this group');

        const data = {
            group: groupId,
            sender: senderId,
            text: payload.text,
            attachments: payload.attachments || [],
        };
        return await Message.create(data);
    }

    async listGroupMessages(groupId, userId) {
        const group = await Group.findById(groupId);
        if(!group) throw new Error('Group not found');

        const isMember = group.members.some(m => m.userId.toString() === userId);
        if(!isMember) throw new Error('You are not a member of this group');

        const query = { group: groupId };

        return await Message.find(query)
            .sort({ createdAt: -1 })
            .populate('sender', '_id full_name email');
    }
}

module.exports = new MessageService();
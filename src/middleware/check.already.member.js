const Group = require('../models/group.model');

const checkAlreadyMember = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;

        const group = await Group.findById(groupId);
        if(!group) return res.status(404).json({ error: 'Group not found' });

        const alreadyMember = group.members.some(m => m.userId.toString() === userId);
        if(alreadyMember) {
            return res.status(400).json({ error: 'User already joined this group' });
        }

        next();
    } catch(err) {
        res.status(500).json({ error: 'Failed to check membership: ' + err.message });
    }
}

module.exports = checkAlreadyMember;

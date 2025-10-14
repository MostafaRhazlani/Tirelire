const GroupServices = require('../services/group.services');

class GroupController {
    async store(req ,res) {
        try {
            req.body.owner = req.user.id;

            const group = await GroupServices.store(req.body);
            res.status(201).json({ message: 'Group created successfully!', group });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async joinGroup(req, res) {
        try {
            
            const group = await GroupServices.joinGroup(req.params.id, req.user);
            res.status(200).json({ message: 'You have successfully joined the group', group });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async leaveGroup(req, res) {
        try {

            const group = await GroupServices.leaveGroup(req.params.id, req.user.id);
            res.status(200).json({ message: 'You have successfully left the group', group });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateRules(req, res) {
        try {
            
            const group = await GroupServices.updateRules(req.params.id, req.user.id, req.body);

            res.status(200).json({
                message: 'Group rules updated successfully',
                group
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new GroupController;
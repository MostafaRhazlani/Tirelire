const MessageService = require('../services/message.services');

class MessageController {
    async sendToGroup(req ,res) {
        try {
            const message = await MessageService.createMessage(req.params.groupId, req.user.id, req.body);
            res.status(201).json({ message: 'Message sent', data: message });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async listGroupMessages(req, res) {
        try {
            const messages = await MessageService.listGroupMessages(req.params.groupId,req.user.id);
            res.status(200).json({ data: messages });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new MessageController;
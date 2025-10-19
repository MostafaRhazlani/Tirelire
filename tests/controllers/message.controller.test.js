const MessageController = require('../../src/controllers/message.controller');
const MessageService = require('../../src/services/message.services');

// Mock the entire MessageService module
jest.mock('../../src/services/message.services');

describe('MessageController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { groupId: 'group123' },
      user: { id: 'user123' },
      body: { text: 'Hello world' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ---------------- sendToGroup ----------------
  describe('sendToGroup', () => {
    it('should send message successfully', async () => {
      const mockMessage = { _id: 'msg1', text: 'Hello world' };
      MessageService.createMessage.mockResolvedValue(mockMessage);

      await MessageController.sendToGroup(req, res);

      expect(MessageService.createMessage).toHaveBeenCalledWith(
        req.params.groupId,
        req.user.id,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Message sent',
        data: mockMessage,
      });
    });

    it('should handle errors when sending message', async () => {
      MessageService.createMessage.mockRejectedValue(new Error('Failed to send'));

      await MessageController.sendToGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to send' });
    });
  });

  // ---------------- listGroupMessages ----------------
  describe('listGroupMessages', () => {
    it('should list group messages successfully', async () => {
      const mockMessages = [
        { _id: '1', text: 'Hi' },
        { _id: '2', text: 'Hello' },
      ];
      MessageService.listGroupMessages.mockResolvedValue(mockMessages);

      await MessageController.listGroupMessages(req, res);

      expect(MessageService.listGroupMessages).toHaveBeenCalledWith(
        req.params.groupId,
        req.user.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockMessages });
    });

    it('should handle errors when listing messages', async () => {
      MessageService.listGroupMessages.mockRejectedValue(new Error('Group not found'));

      await MessageController.listGroupMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Group not found' });
    });
  });
});

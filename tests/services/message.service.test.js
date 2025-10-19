const MessageService = require('../../src/services/message.services');
const Message = require('../../src/models/message.model');
const Group = require('../../src/models/group.model');

jest.mock('../../src/models/message.model');
jest.mock('../../src/models/group.model');

describe('MessageService', () => {
  it('should throw error if group not found', async () => {
    Group.findById.mockResolvedValue(null);

    await expect(MessageService.createMessage('g1', 'u1', { text: 'Hi' }))
      .rejects.toThrow('Group not found');
  });

  it('should create a message when user is a group member', async () => {
    Group.findById.mockResolvedValue({
      members: [{ userId: 'u1' }],
    });
    Message.create.mockResolvedValue({ text: 'Hi', group: 'g1', sender: 'u1' });

    const message = await MessageService.createMessage('g1', 'u1', { text: 'Hi' });

    expect(Message.create).toHaveBeenCalled();
    expect(message.text).toBe('Hi');
  });
});

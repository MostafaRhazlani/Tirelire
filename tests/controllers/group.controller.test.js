const GroupController = require('../../src/controllers/group.controller');
const GroupServices = require('../../src/services/group.services');

// mock all service methods so they don't really hit DB
jest.mock('../../src/services/group.services');

describe('GroupController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: { id: 'group123' },
      user: { id: 'user123' },
      file: { filename: 'file.jpg' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ------------------ store ------------------
  describe('store', () => {
    it('should create a group successfully', async () => {
      const mockGroup = { _id: '1', name: 'Test Group' };
      GroupServices.store.mockResolvedValue(mockGroup);

      await GroupController.store(req, res);

      expect(GroupServices.store).toHaveBeenCalledWith({
        ...req.body,
        owner: req.user.id,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Group created successfully!',
        group: mockGroup,
      });
    });

    it('should handle errors when creating a group', async () => {
      GroupServices.store.mockRejectedValue(new Error('DB error'));

      await GroupController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  // ------------------ joinGroup ------------------
  describe('joinGroup', () => {
    it('should join group successfully', async () => {
      const mockGroup = { _id: '1', name: 'Joined Group' };
      GroupServices.joinGroup.mockResolvedValue(mockGroup);

      await GroupController.joinGroup(req, res);

      expect(GroupServices.joinGroup).toHaveBeenCalledWith(req.params.id, req.user, req.file);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'You have successfully joined the group',
        group: mockGroup,
      });
    });

    it('should handle errors when joining a group', async () => {
      GroupServices.joinGroup.mockRejectedValue(new Error('Join failed'));

      await GroupController.joinGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Join failed' });
    });
  });

  // ------------------ leaveGroup ------------------
  describe('leaveGroup', () => {
    it('should leave group successfully', async () => {
      const mockGroup = { _id: '1', name: 'Left Group' };
      GroupServices.leaveGroup.mockResolvedValue(mockGroup);

      await GroupController.leaveGroup(req, res);

      expect(GroupServices.leaveGroup).toHaveBeenCalledWith(req.params.id, req.user.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'You have successfully left the group',
        group: mockGroup,
      });
    });

    it('should handle errors when leaving a group', async () => {
      GroupServices.leaveGroup.mockRejectedValue(new Error('Leave failed'));

      await GroupController.leaveGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Leave failed' });
    });
  });

  // ------------------ updateRules ------------------
  describe('updateRules', () => {
    it('should update rules successfully', async () => {
      const mockGroup = { _id: '1', rules: { min: 10 } };
      GroupServices.updateRules.mockResolvedValue(mockGroup);

      await GroupController.updateRules(req, res);

      expect(GroupServices.updateRules).toHaveBeenCalledWith(req.params.id, req.user.id, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Group rules updated successfully',
        group: mockGroup,
      });
    });

    it('should handle errors when updating rules', async () => {
      GroupServices.updateRules.mockRejectedValue(new Error('Invalid rules'));

      await GroupController.updateRules(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid rules' });
    });
  });

  // ------------------ updateScoreAllMembers ------------------
  describe('updateScoreAllMembers', () => {
    it('should update scores successfully', async () => {
      const mockResult = [{ id: '1', score: 100 }];
      GroupServices.updateScoreAllMembers.mockResolvedValue(mockResult);

      await GroupController.updateScoreAllMembers(req, res);

      expect(GroupServices.updateScoreAllMembers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ groups: mockResult });
    });

    it('should handle errors when updating scores', async () => {
      GroupServices.updateScoreAllMembers.mockRejectedValue(new Error('Score update failed'));

      await GroupController.updateScoreAllMembers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Score update failed' });
    });
  });
});

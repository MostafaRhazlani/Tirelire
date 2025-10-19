const RoundController = require('../../src/controllers/round.controller');
const RoundServices = require('../../src/services/round.services');

// Mock the RoundServices module
jest.mock('../../src/services/round.services');

describe('RoundController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { groupId: 'group123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ---------------- createNextRound ----------------
  describe('createNextRound', () => {
    it('should create next round successfully', async () => {
      const mockNextRound = { _id: 'round1', status: 'active' };
      RoundServices.createNextRound.mockResolvedValue(mockNextRound);

      await RoundController.createNextRound(req, res);

      // Ensure the service was called with the right argument
      expect(RoundServices.createNextRound).toHaveBeenCalledWith(req.params.groupId);

      // Check response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Next round is start',
        nextRound: mockNextRound,
      });
    });

    it('should handle errors when creating next round', async () => {
      RoundServices.createNextRound.mockRejectedValue(new Error('Group not found'));

      await RoundController.createNextRound(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Group not found' });
    });
  });
});

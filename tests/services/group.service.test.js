const GroupServices = require('../../src/services/group.services');
const Group = require('../../src/models/group.model');
const User = require('../../src/models/user.model');
const RoundServices = require('../../src/services/round.services');

jest.mock('../../src/models/group.model');
jest.mock('../../src/models/user.model');
jest.mock('../../src/services/round.services');

describe('GroupServices', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should create a new group and call createInitialRound', async () => {
      const mockGroup = { _id: '123', groupName: 'test group' };
      Group.create.mockResolvedValue(mockGroup);
      RoundServices.createInitialRound.mockResolvedValue({});

      const result = await GroupServices.store({ groupName: 'test group' });

      expect(Group.create).toHaveBeenCalledWith({ groupName: 'test group' });
      expect(RoundServices.createInitialRound).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockGroup);
    });

    it('should throw error if group creation fails', async () => {
      Group.create.mockRejectedValue(new Error('db error'));

      await expect(GroupServices.store({})).rejects.toThrow('Failed to create group');
    });
  });

  describe('calculateScoreFrequency', () => {
    it('should calculate weekly frequency', () => {
      const joinDate = new Date('2025-01-01');
      const currentDate = new Date('2025-02-01');
      const score = GroupServices.calculateScoreFrequency('weekly', currentDate, joinDate);
      expect(score).toBeGreaterThan(0);
    });
  });
});

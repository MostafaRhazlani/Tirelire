const RoundServices = require('../../src/services/round.services');
const Group = require('../../src/models/group.model');
const ContributionRound = require('../../src/models/round.model');

jest.mock('../../src/models/group.model');
jest.mock('../../src/models/round.model');

describe('RoundServices', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateEndDate', () => {
    it('should add 7 days for weekly frequency', () => {
      const fromDate = new Date('2025-10-01');
      const endDate = RoundServices.calculateEndDate('weekly', fromDate);
      expect(endDate.getDate()).toBe(fromDate.getDate() + 7);
    });

    it('should add 1 month for monthly frequency', () => {
      const fromDate = new Date('2025-10-01');
      const endDate = RoundServices.calculateEndDate('monthly', fromDate);
      expect(endDate.getMonth()).toBe(fromDate.getMonth() + 1);
    });
  });

  describe('createInitialRound', () => {
    it('should create initial round successfully', async () => {
      const mockGroup = {
        _id: 'g1',
        rules: { contributionFrequency: 'weekly' },
        members: [{ userId: { _id: 'u1', punctualityScore: 10 } }]
      };
      Group.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockGroup)
      });
      ContributionRound.create.mockResolvedValue({ roundNumber: 1, groupId: 'g1' });

      const round = await RoundServices.createInitialRound('g1');

      expect(Group.findById).toHaveBeenCalledWith('g1');
      expect(ContributionRound.create).toHaveBeenCalled();
      expect(round.roundNumber).toBe(1);
    });

    it('should throw error if group not found', async () => {
      Group.findById.mockResolvedValue(null);

      await expect(RoundServices.createInitialRound('g1'))
        .rejects.toThrow('Failed to create initial round');
    });
  });

  describe('createNextRound', () => {
    it('should throw error if group not found', async () => {
        Group.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });

      await expect(RoundServices.createNextRound('g1'))
        .rejects.toThrow('Group not found');
    });

    it('should create a new round when previous rounds exist and distributed', async () => {
      const mockGroup = {
        _id: 'g1',
        rules: { contributionFrequency: 'weekly' },
        members: [{ userId: { _id: 'u1', punctualityScore: 10 } }]
      };
      Group.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockGroup)
      });

      ContributionRound.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({ roundNumber: 1, distributed: true, endDate: new Date() })
      });
      ContributionRound.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ beneficiary: 'u2' }])
      });
      ContributionRound.create.mockResolvedValue({ roundNumber: 2 });

      const newRound = await RoundServices.createNextRound('g1');

      expect(ContributionRound.create).toHaveBeenCalled();
      expect(newRound.roundNumber).toBe(2);
    });
  });
});

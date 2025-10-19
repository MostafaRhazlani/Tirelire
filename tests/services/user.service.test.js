const UserService = require('../../src/services/user.services');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user.model');
jest.mock('jsonwebtoken');

describe('UserService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should create a user successfully', async () => {
      const mockUser = { _id: 'u1', full_name: 'Test' };
      User.create.mockResolvedValue(mockUser);

      const result = await UserService.store({ full_name: 'Test' });

      expect(User.create).toHaveBeenCalledWith({ full_name: 'Test' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(UserService.login({ email: 'a@b.com', password: '123' }))
        .rejects.toThrow('Email or password is incorrect!');
    });

    it('should throw error if password is wrong', async () => {
      User.findOne.mockResolvedValue({ password: '1234' });

      await expect(UserService.login({ email: 'a@b.com', password: '123' }))
        .rejects.toThrow('Email or password is incorrect!');
    });

    it('should return JWT token if login is successful', async () => {
      const mockUser = { _id: 'u1', full_name: 'Test', email: 'a@b.com', role: 'Particulier', password: '123' };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockToken');

      const token = await UserService.login({ email: 'a@b.com', password: '123' });

      expect(jwt.sign).toHaveBeenCalledWith({
        id: 'u1',
        full_name: 'Test',
        email: 'a@b.com',
        role: 'Particulier',
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(token).toBe('mockToken');
    });
  });
});

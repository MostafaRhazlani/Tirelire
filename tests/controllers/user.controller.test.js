const UserController = require('../../src/controllers/user.controller');
const UserService = require('../../src/services/user.services');

// Mock the entire UserService to avoid real DB calls
jest.mock('../../src/services/user.services');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        full_name: 'Mostafa Rhazlani',
        email: 'mo@example.com',
        password: 'password',
        phone: '0612345678',
        cin: 'HH12345',
      },
      file: { filename: 'id_image.jpg' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ---------------- store ----------------
  describe('store', () => {
    it('should create a user successfully', async () => {
      const mockUser = { _id: '1', full_name: 'Mostafa Rhazlani' };
      UserService.store.mockResolvedValue(mockUser);

      await UserController.store(req, res);

      expect(UserService.store).toHaveBeenCalledWith({
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        cin: req.body.cin,
        nationalIdImage: req.file.filename,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully!',
        user: mockUser,
      });
    });

    it('should handle errors when creating user', async () => {
      UserService.store.mockRejectedValue(new Error('Email already exists'));

      await UserController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
  });

  // ---------------- login ----------------
  describe('login', () => {
    it('should log in user successfully', async () => {
      const mockToken = 'jwt.token.123';
      UserService.login.mockResolvedValue(mockToken);

      await UserController.login(req, res);

      expect(UserService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User logged successfully!',
        token: mockToken,
      });
    });

    it('should handle login errors', async () => {
      UserService.login.mockRejectedValue(new Error('Invalid credentials'));

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});

const PaymentController = require('../../src/controllers/payment.controller');
const PaymentService = require('../../src/services/payment.service');

// Mock the PaymentService to avoid real database or API calls
jest.mock('../../src/services/payment.service');

jest.mock("stripe", () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: jest.fn().mockResolvedValue({ id: "pi_123", client_secret: "secret_123" })
        }
    }));
});

describe('PaymentController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        groupId: 'group123',
        roundId: 'round456',
        amount: 100,
      },
      user: { id: 'user789' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ---------------- createPayment ----------------
  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const mockResult = {
        contributionRound: { id: 'round456' },
        payment: { id: 'pay001', amount: 100 },
        clientSecret: 'secret_123',
      };

      PaymentService.createPayment.mockResolvedValue(mockResult);

      await PaymentController.createPayment(req, res);

      expect(PaymentService.createPayment).toHaveBeenCalledWith(
        req.user.id,
        req.body.groupId,
        req.body.roundId,
        req.body.amount
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        contributionRound: mockResult.contributionRound,
        payment: mockResult.payment,
        clientSecret: mockResult.clientSecret,
      });
    });

    it('should handle errors from PaymentService', async () => {
      PaymentService.createPayment.mockRejectedValue(new Error('Payment failed'));

      await PaymentController.createPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Payment failed',
      });
    });
  });
});

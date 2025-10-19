const PaymentService = require("../../src/services/payment.service");
const Payment = require("../../src/models/payment.model");
const Group = require("../../src/models/group.model");
const ContributionRound = require("../../src/models/round.model");

jest.mock("../../src/models/payment.model");
jest.mock("../../src/models/group.model");
jest.mock("../../src/models/round.model");

jest.mock("stripe", () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: jest.fn().mockResolvedValue({ id: "pi_123", client_secret: "secret_123" })
        }
    }));
});

describe("PaymentService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a payment successfully", async () => {
        Group.findById.mockResolvedValue({
            _id: "g1",
            members: [{ userId: "u1" }],
        });
        ContributionRound.findById.mockResolvedValue({
            _id: "r1",
            contributions: [],
            totalCollected: 0,
            save: jest.fn(),
        });
        Payment.create.mockResolvedValue({ _id: "p1" });

        const result = await PaymentService.createPayment("u1", "g1", "r1", 100);

        expect(Group.findById).toHaveBeenCalledWith("g1");
        expect(ContributionRound.findById).toHaveBeenCalledWith("r1");
        expect(Payment.create).toHaveBeenCalled();

        expect(result.payment._id).toBe("p1");
        expect(result.clientSecret).toBe("secret_123");
    });
});

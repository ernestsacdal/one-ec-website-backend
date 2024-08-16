"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billController_1 = __importDefault(require("../../controllers/bill/billController"));
const apiKey_1 = __importDefault(require("../../middlewares/apiKey"));
const coop_1 = __importDefault(require("../../middlewares/coop"));
const role_1 = __importDefault(require("../../middlewares/role"));
const billRoute = (0, express_1.Router)();
const billController = new billController_1.default();
/**
 * @swagger
 * /api/v1/bill/create/{id}:
 *   post:
 *     summary: Create a new Bill
 *     tags: [Bill]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to create a bill for and send an email summary.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the billing period
 *                 example: "2023-01-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the billing period
 *                 example: "2023-01-31"
 *               nextDate:
 *                 type: string
 *                 format: date
 *                 description: The next date for bill payment
 *                 example: "2023-02-31"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date for bill payment
 *                 example: "2023-02-31"
 *               billDate:
 *                 type: string
 *                 format: date
 *                 description: The bill date for bill payment
 *                 example: "2023-02-31"
 *               readingDate:
 *                 type: string
 *                 format: date
 *                 description: The reading date for bill payment
 *                 example: "2023-02-31"
 *               kwhConsume:
 *                 type: number
 *                 description: The total kWh consumed during the billing period
 *                 example: 150.5
 *               rate:
 *                 type: number
 *                 description: Rate per kWh
 *                 example: 0.12
 *               distribution:
 *                 type: number
 *                 description: Distribution charge
 *                 example: 5.00
 *               generation:
 *                 type: number
 *                 description: Generation charge
 *                 example: 3.00
 *               sLoss:
 *                 type: number
 *                 description: System loss charge
 *                 example: 2.00
 *               transmission:
 *                 type: number
 *                 description: Transmission charge
 *                 example: 4.00
 *               subsidies:
 *                 type: number
 *                 description: Subsidies
 *                 example: 1.00
 *               gTax:
 *                 type: number
 *                 description: Government tax
 *                 example: 0.30
 *               fitAll:
 *                 type: number
 *                 description: FIT-All charge
 *                 example: 0.25
 *               applied:
 *                 type: number
 *                 description: Other applied fees
 *                 example: 0.40
 *               other:
 *                 type: number
 *                 description: Any other charges
 *                 example: 0.50
 *               uCharges:
 *                 type: number
 *                 description: Any other charges
 *                 example: 0.50
 *             required:
 *               - fromDate
 *               - toDate
 *               - kwhConsume
 *               - rate
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Bill created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the bill
 *                     amount:
 *                       type: number
 *                       description: Total amount charged
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the bill was created
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Validation error: Missing required fields"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
billRoute.post("/create/:id/", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['add'], ['/soa']), billController.createBill);
/**
 * @swagger
 * /api/v1/bill/calculate/{id}:
 *   post:
 *     summary: Calculate Bill Details
 *     tags: [Bill]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to calculate.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the billing period
 *                 example: "2023-01-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the billing period
 *                 example: "2023-01-31"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date of the billing period
 *                 example: "2023-02-31"
 *               nextDate:
 *                 type: string
 *                 format: date
 *                 description: The next date of the billing period
 *                 example: "2023-02-31"
 *               billDate:
 *                 type: string
 *                 format: date
 *                 description: The bill date for bill payment
 *                 example: "2023-02-31"
 *               readingDate:
 *                 type: string
 *                 format: date
 *                 description: The reading date for bill payment
 *                 example: "2023-02-31"
 *               kwhConsume:
 *                 type: number
 *                 description: The total kWh consumed during the billing period
 *                 example: 150.5
 *               rate:
 *                 type: number
 *                 description: Rate per kWh
 *                 example: 0.12
 *               distribution:
 *                 type: number
 *                 description: Distribution charge
 *                 example: 5.00
 *               generation:
 *                 type: number
 *                 description: Generation charge
 *                 example: 3.00
 *               sLoss:
 *                 type: number
 *                 description: System loss charge
 *                 example: 2.00
 *               transmission:
 *                 type: number
 *                 description: Transmission charge
 *                 example: 4.00
 *               subsidies:
 *                 type: number
 *                 description: Subsidies
 *                 example: 1.00
 *               gTax:
 *                 type: number
 *                 description: Government tax
 *                 example: 0.30
 *               fitAll:
 *                 type: number
 *                 description: FIT-All charge
 *                 example: 0.25
 *               applied:
 *                 type: number
 *                 description: Other applied fees
 *                 example: 0.40
 *               other:
 *                 type: number
 *                 description: Any other charges
 *                 example: 0.50
 *               uCharges:
 *                 type: number
 *                 description: Universal charges
 *                 example: 0.50
 *             required:
 *               - fromDate
 *               - toDate
 *               - dueDate
 *               - kwhConsume
 *               - rate
 *     responses:
 *       200:
 *         description: Bill details calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Bill details calculated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAmount:
 *                       type: number
 *                       description: Total amount to be charged
 *                     components:
 *                       type: object
 *                       description: Breakdown of individual components of the bill
 *                       properties:
 *                         distributionCharge:
 *                           type: number
 *                         generationCharge:
 *                           type: number
 *                         systemLossCharge:
 *                           type: number
 *                         transmissionCharge:
 *                           type: number
 *                         subsidiesCharge:
 *                           type: number
 *                         governmentTax:
 *                           type: number
 *                         fitAllCharge:
 *                           type: number
 *                         appliedCharge:
 *                           type: number
 *                         otherCharge:
 *                           type: number
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Validation error: Missing required fields"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
billRoute.post("/calculate/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['add'], ['/soa']), billController.calculateBillDetails);
/**
 * @swagger
 * /api/v1/bill/list/{id}:
 *   get:
 *     summary: Get all bill per account
 *     tags: [Bill]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: AR ID.
 *     responses:
 *       200:
 *         description: Bill retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */
billRoute.get("/list/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(["view"], ['/soa']), billController.list);
/**
 * @swagger
 * /api/v1/bill/show/{id}:
 *   get:
 *     summary: Get a account registry by ID
 *     tags: [Bill]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Bill ID
 *     responses:
 *       200:
 *         description: Bill retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       404:
 *         description: cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */
billRoute.get("/show/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['view'], ['/soa']), billController.show);
exports.default = billRoute;
//# sourceMappingURL=index.js.map
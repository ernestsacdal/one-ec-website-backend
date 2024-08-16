"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiKey_1 = __importDefault(require("../../middlewares/apiKey"));
const coop_1 = __importDefault(require("../../middlewares/coop"));
const arController_1 = __importDefault(require("../../controllers/ar/arController"));
const role_1 = __importDefault(require("../../middlewares/role"));
const arRoute = (0, express_1.Router)();
const arController = new arController_1.default();
/**
 * @swagger
 * /api/v1/ar/list:
 *   get:
 *     summary: Get all Approved Account Registry
 *     tags: [Account Registry]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account Registry retrieved successfully
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
arRoute.get("/listAll", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)([], ['/soa']), arController.listAll);
/**
 * @swagger
 * /api/v1/ar/list:
 *   get:
 *     summary: Get all Account Registry
 *     tags: [Account Registry]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account Registry retrieved successfully
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
arRoute.get("/list", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)([], ['/soa']), arController.list);
/**
 * @swagger
 * /api/v1/ar/show/{id}:
 *   get:
 *     summary: Get a account registry by ID
 *     tags: [Account Registry]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The account registry ID
 *     responses:
 *       200:
 *         description: Account registry retrieved successfully
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
arRoute.get("/show/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['view'], ['/soa']), arController.show);
exports.default = arRoute;
//# sourceMappingURL=index.js.map
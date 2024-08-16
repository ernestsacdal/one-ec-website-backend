"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coopController_1 = __importDefault(require("../../controllers/coop/coopController"));
const apiKey_1 = __importDefault(require("../../middlewares/apiKey"));
const admin_1 = __importDefault(require("../../middlewares/admin"));
const coopRoute = (0, express_1.Router)();
const coopController = new coopController_1.default();
/**
 * @swagger
 * /api/v1/coop/create:
 *   post:
 *     summary: Create a new Cooperative
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the cooperative
 *                 example: "Sunshine Electric Cooperative"
 *               description:
 *                 type: string
 *                 description: The description of the cooperative
 *                 example: "A cooperative that provides reliable electric services."
 *               address:
 *                 type: string
 *                 description: The address of the cooperative
 *                 example: "gg"
 *               coordinator:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     description: The email of the coordinator
 *                     example: "sacdalernest03@gmail.com"
 *                   contact_number:
 *                     type: string
 *                     description: The contact number of the coordinator
 *                     example: "123-456-7890"
 *             required:
 *               - name
 *               - coordinator
 *     responses:
 *       201:
 *         description: Cooperative created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     coop:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique identifier for the cooperative
 *                         name:
 *                           type: string
 *                           description: Name of the cooperative
 *                         description:
 *                           type: string
 *                           description: Description of the cooperative
 *                         address:
 *                           type: string
 *                           description: Address of the cooperative
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the cooperative was created
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the cooperative was last updated
 *                     coordinator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique identifier for the coordinator
 *                         first_name:
 *                           type: string
 *                           description: First name of the coordinator
 *                         middle_name:
 *                           type: string
 *                           description: Middle name of the coordinator
 *                         last_name:
 *                           type: string
 *                           description: Last name of the coordinator
 *                         email:
 *                           type: string
 *                           description: Email of the coordinator
 *                         contact_number:
 *                           type: string
 *                           description: Contact number of the coordinator
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the coordinator was created
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the coordinator was last updated
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique identifier for the role
 *                         name:
 *                           type: string
 *                           description: Name of the role
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: List of permissions
 *                         modules:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: List of modules
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the role was created
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the role was last updated
 *                     coordinatorRole:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique identifier for the coordinator role
 *                         coordinatorId:
 *                           type: string
 *                           description: Identifier for the coordinator
 *                         roleId:
 *                           type: string
 *                           description: Identifier for the role
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the coordinator role was created
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp when the coordinator role was last updated
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 code:
 *                   type: integer
 *                   description: Status code
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: integer
 *                   description: Status code
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
 *                 code:
 *                   type: integer
 *                   description: Status code
 */
coopRoute.post("/create", apiKey_1.default, admin_1.default.authToken, coopController.create);
/**
 * @swagger
 * /api/v1/coop/update/{coopId}:
 *   put:
 *     summary: Update an existing Cooperative
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cooperative to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the cooperative
 *                 example: "Tech Coop New"
 *               description:
 *                 type: string
 *                 description: The updated description of the cooperative
 *                 example: "An updated description of the technology-focused cooperative"
 *               email:
 *                 type: string
 *                 description: The email of the cooperative
 *                 example: "sample@email.com"
 *               contact:
 *                 type: string
 *                 description: The contact of the cooperative
 *                 example: "09123456789"
 *     responses:
 *       200:
 *         description: Cooperative updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the cooperative
 *                     name:
 *                       type: string
 *                       description: Updated name of the cooperative
 *                     description:
 *                       type: string
 *                       description: Updated description of the cooperative
 *                     email:
 *                       type: string
 *                       description: Updated email of the cooperative
 *                     contact:
 *                       type: string
 *                       description: Updated contact of the cooperative
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the cooperative was last updated
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */
coopRoute.put("/update/:id", apiKey_1.default, admin_1.default.authToken, coopController.update);
/**
 * @swagger
 * /api/v1/coop/show/{id}:
 *   get:
 *     summary: Get a cooperative by ID
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cooperative ID
 *     responses:
 *       200:
 *         description: cooperative retrieved successfully
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
coopRoute.get("/show/:id", apiKey_1.default, admin_1.default.authToken, coopController.show);
/**
 * @swagger
 * /api/v1/coop/list:
 *   get:
 *     summary: Get all campuses
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cooperatives retrieved successfully
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
coopRoute.get("/list", apiKey_1.default, admin_1.default.authToken, coopController.list);
/**
 * @swagger
 * /api/v1/coop/delete/{id}:
 *   delete:
 *     summary: Delete a cooperative by ID
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cooperative ID
 *     responses:
 *       200:
 *         description: Cooperative deleted successfully
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
 *         description: Cooperative not found
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
coopRoute.delete("/delete/:id", apiKey_1.default, admin_1.default.authToken, coopController.delete);
exports.default = coopRoute;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = __importDefault(require("../../controllers/role/roleController"));
const apiKey_1 = __importDefault(require("../../middlewares/apiKey"));
const coop_1 = __importDefault(require("../../middlewares/coop"));
const role_1 = __importDefault(require("../../middlewares/role"));
const roleRoute = (0, express_1.Router)();
const roleController = new roleController_1.default();
/**
 * @swagger
 * /api/v1/role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Role Management]
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
 *                 description: The name of the role
 *                 example: "Administrator"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [view, add, edit, delete]
 *                 description: Permissions associated with the role
 *                 example: ["view", "add"]
 *               modules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: UI modules accessible by the role
 *                 example: ["/soa", "/role"]
 *             required:
 *               - name
 *               - permissions
 *               - modules
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: string
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
roleRoute.post("/create", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['add'], ['/role']), roleController.create);
/**
 * @swagger
 * /api/v1/role/update/{roleId}:
 *   put:
 *     summary: Update an existing Role
 *     tags: [Role Management]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the role
 *                 example: "Administrator Updated"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [view, add, edit, delete]
 *                 description: Updated permissions associated with the role
 *                 example: ["edit", "delete"]
 *               modules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated UI modules accessible by the role
 *                 example: ["/soa", "/role"]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: string
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the role was last updated
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
 *         description: Role not found
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
roleRoute.put("/update/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['edit'], ['/role']), roleController.update);
/**
 * @swagger
 * /api/v1/role/show/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Role Management]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role retrieved successfully
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
 *         description: Role not found
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
roleRoute.get("/show/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['view'], ['/role']), roleController.show);
/**
 * @swagger
 * /api/v1/role/list:
 *   get:
 *     summary: Get all roles
 *     tags: [Role Management]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
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
roleRoute.get("/list", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['view'], ['/role']), roleController.list);
/**
 * @swagger
 * /api/v1/role/delete/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Role Management]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
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
roleRoute.delete("/delete/:id", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['delete'], ['/role']), roleController.delete);
/**
 * @swagger
 * /api/v1/role/roleCoor:
 *   get:
 *     summary: Get the role of a coordinator by their ID
 *     tags: [Role Management]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coordinator Role retrieved successfully
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
 *         description: Coordinator not found
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
roleRoute.get("/roleCoor", apiKey_1.default, coop_1.default.authToken, roleController.role);
exports.default = roleRoute;
//# sourceMappingURL=index.js.map
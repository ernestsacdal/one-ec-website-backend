"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../../controllers/user/userController"));
const apiKey_1 = __importDefault(require("../../middlewares/apiKey"));
const coop_1 = __importDefault(require("../../middlewares/coop"));
const role_1 = __importDefault(require("../../middlewares/role"));
const userRoute = (0, express_1.Router)();
const userController = new userController_1.default();
/**
* @swagger
* /api/v1/user/create:
*   post:
*     summary: Create User API
*     description: |
*       This endpoint allows for the creation of a new user along with meter account details. A random password is generated, hashed, and associated with the user. A meter account is created with the user's name, and an account registry entry is made.
*     tags: [User Management]
*     security:
*       - bearerAuth: []
*       - apiKeyAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userData:
*                 type: object
*                 description: Personal details of the user
*                 properties:
*                   first_name:
*                     type: string
*                     description: First name of the user
*                     example: John
*                     required: true
*                   middle_name:
*                     type: string
*                     description: Middle name of the user
*                     example: A.
*                     nullable: true
*                   last_name:
*                     type: string
*                     description: Last name of the user
*                     example: Doe
*                     required: true
*                   birthdate:
*                     type: string
*                     format: date
*                     description: Birthdate of the user
*                     nullable: true
*                   email:
*                     type: string
*                     description: Email address of the user
*                     example: johndoe@example.com
*                   contact_number:
*                     type: string
*                     description: Contact number of the user
*                     example: "+1234567890"
*                     nullable: true
*                   gender:
*                     type: string
*                     description: Gender of the user
*                     example: "Male"
*                     nullable: true
*                   address:
*                     type: string
*                     description: Residential address of the user
*                     example: "123 Main St, Anytown, USA"
*                     nullable: true
*               meterData:
*                 type: object
*                 description: Meter installation details for the user
*                 properties:
*                   meterNumber:
*                     type: integer
*                     description: Unique meter identifier
*                     example: 12345678
*                   customerType:
*                     type: string
*                     description: Type of customer for the meter
*                     example: "Residential"
*                     nullable: true
*                   meterActivated:
*                     type: boolean
*                     description: Status indicating if the meter is activated
*                     example: true
*     responses:
*       '201':
*         description: User, meter account, and account registry created successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: object
*                   properties:
*                     user:
*                       type: object
*                       properties:
*                         id:
*                           type: integer
*                           example: 1
*                         firstName:
*                           type: string
*                           example: John
*                         lastName:
*                           type: string
*                           example: Doe
*                         email:
*                           type: string
*                           example: johndoe@example.com
*                         contactNumber:
*                           type: string
*                           example: "+1234567890"
*                     meterAccount:
*                       type: object
*                       properties:
*                         meterNumber:
*                           type: integer
*                           example: 12345678
*                     accountRegistry:
*                       type: object
*                       properties:
*                         id:
*                           type: integer
*                           example: 1
*                 message:
*                   type: string
*                   example: User created successfully
*                 response:
*                   type: string
*                   example: Success
*                 code:
*                   type: integer
*                   example: 201
*       '400':
*         description: Validation error or email already exists
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Validation error
*                 response:
*                   type: string
*                   example: Error
*                 code:
*                   type: integer
*                   example: 400
*       '500':
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Internal server error
*                 response:
*                   type: string
*                   example: Error
*                 code:
*                   type: integer
*                   example: 500
*/
userRoute.post("/create", apiKey_1.default, coop_1.default.authToken, (0, role_1.default)(['add'], ['/users']), userController.create);
/**
 * @swagger
 * /api/v1/user/authenticate:
 *   post:
 *     summary: Authentication API
 *     description: |
 *       This endpoint allows the user to log in.
 *     tags: [User Management]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email is required
 *                 example: sacdalernest02@gmail.com
 *               password:
 *                 type: string
 *                 description: Password is required
 *                 example: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 401
 */
userRoute.post("/authenticate", apiKey_1.default, userController.auth);
/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Management]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *                 example: "John"
 *               middle_name:
 *                 type: string
 *                 description: Middle name of the user
 *                 example: "A"
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *                 example: "Doe"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Birthdate of the user
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: "john.doe@example.com"
 *               contact_number:
 *                 type: string
 *                 description: Contact number of the user
 *                 example: "123-456-7890"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender of the user
 *                 example: "male"
 *               address:
 *                 type: string
 *                 description: Address of the user
 *                 example: "123 Main St"
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: "userPassword123"
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the user
 *                     first_name:
 *                       type: string
 *                       description: First name of the user
 *                     middle_name:
 *                       type: string
 *                       description: Middle name of the user
 *                     last_name:
 *                       type: string
 *                       description: Last name of the user
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                       description: Birthdate of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     contact_number:
 *                       type: string
 *                       description: Contact number of the user
 *                     gender:
 *                       type: string
 *                       description: Gender of the user
 *                     address:
 *                       type: string
 *                       description: Address of the user
 *                     role:
 *                       type: string
 *                       description: Role of the user
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the user was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the user was last updated
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
userRoute.post("/register", apiKey_1.default, userController.register);
/**
 * @swagger
 * /api/v1/user/forgot:
 *   post:
 *     summary: Forgot Password API
 *     description: This endpoint allows a user to request a password reset link to be sent to their registered email.
 *     tags: [User Management]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Registered email of the user
 *                 example: sampleemail@gmail.com
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset link sent successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Error sending password reset link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error: User not found"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 */
userRoute.post("/forgot", apiKey_1.default, userController.forgotPassword);
/**
 * @swagger
 * /api/v1/user/reset:
 *   post:
 *     summary: Reset Password API
 *     description: This endpoint allows a user to reset their password using a token sent to their email.
 *     tags: [User Management]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token received in the password reset email
 *                 example: dummytoken123
 *               newPassword:
 *                 type: string
 *                 description: New password
 *                 example: newSecurePassword123
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired password reset token"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 */
userRoute.post("/reset", apiKey_1.default, userController.resetPassword);
exports.default = userRoute;
//# sourceMappingURL=index.js.map
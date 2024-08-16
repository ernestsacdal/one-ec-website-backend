"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../../controllers/admin/adminController"));
const apiKey_1 = __importDefault(require("../../middlewares/apiKey"));
const admin_1 = __importDefault(require("../../middlewares/admin"));
const adminRoute = (0, express_1.Router)();
const adminController = new adminController_1.default();
/**
 * @swagger
 * /api/v1/admin/authenticate:
 *   post:
 *     summary: Authentication API
 *     description: |
 *       This endpoint allows the admin to log in.
 *     tags: [Admin Authentication]
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
adminRoute.post("/authenticate", apiKey_1.default, adminController.auth);
/**
 * @swagger
 * /api/v1/admin/forgot:
 *   post:
 *     summary: Forgot Password API
 *     description: This endpoint allows an admin to request a password reset link to be sent to their registered email.
 *     tags: [Admin Authentication]
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
 *                 description: Registered email of the admin
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
 *                   example: "Error: Admin not found"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 */
adminRoute.post("/forgot", apiKey_1.default, adminController.forgotPassword);
/**
 * @swagger
 * /api/v1/admin/reset:
 *   post:
 *     summary: Reset Password API
 *     description: This endpoint allows an admin to reset their password using a token sent to their email.
 *     tags: [Admin Authentication]
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
adminRoute.post("/reset", apiKey_1.default, adminController.resetPassword);
/**
 * @swagger
 * /api/v1/admin/change-password:
 *   put:
 *     summary: Change Password API
 *     description: This endpoint allows an admin to change their password.
 *     tags: [Admin Authentication]
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
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the admin
 *                 example: currentPassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password for the admin
 *                 example: newSecurePassword123
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *                 example: newSecurePassword123
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Invalid password or passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 401
 */
adminRoute.put("/change-password", apiKey_1.default, admin_1.default.authToken, adminController.changePassword);
/**
 * @swagger
 * /api/v1/admin/logout:
 *   post:
 *     summary: Logout API
 *     description: |
 *       This endpoint allows the admin to log out.
 *     tags: [Admin Authentication]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       '200':
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '401':
 *         description: Unauthorized access, invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized, please login again
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 401
 */
adminRoute.post("/logout", apiKey_1.default, admin_1.default.authToken, adminController.logout);
exports.default = adminRoute;
//# sourceMappingURL=index.js.map
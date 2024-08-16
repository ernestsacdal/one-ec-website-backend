"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custUpdateSchema = exports.userSchema = exports.meterDataSchema = exports.userDataSchema = exports.updateCoordinatorSchema = exports.billCreationSchema = exports.coorSchemaUpdate = exports.createCoordinatorSchema = exports.roleSchemaUpdate = exports.roleSchemaCreate = exports.coopSchemaUpdate = exports.coopSchema = exports.passwordChangeSchema = exports.resetPasswordSchema = exports.requestResetSchema = void 0;
const zod_1 = require("zod");
exports.requestResetSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8),
});
exports.passwordChangeSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string()
}).refine(data => data.confirmPassword === data.newPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
exports.coopSchema = zod_1.z.object({
    name: zod_1.z.string().max(255),
    description: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().max(255),
    coordinator: zod_1.z.object({
        first_name: zod_1.z.string().optional(),
        middle_name: zod_1.z.string().optional(),
        last_name: zod_1.z.string().optional(),
        email: zod_1.z.string().email(),
        contact_number: zod_1.z.string(),
        address: zod_1.z.string().optional(),
    }),
});
exports.coopSchemaUpdate = zod_1.z.object({
    name: zod_1.z.string().max(255).optional(),
    description: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().max(255).optional(),
});
exports.roleSchemaCreate = zod_1.z.object({
    name: zod_1.z.string().max(255),
    permissions: zod_1.z.array(zod_1.z.enum(["view", "add", "edit", "delete"])).min(1, "At least one permission is required"),
    modules: zod_1.z.array(zod_1.z.enum(["/soa", "/role", "/users", "/customer-management", "/approvals"])).min(1, "At least one module is required"),
});
exports.roleSchemaUpdate = zod_1.z.object({
    name: zod_1.z.string().max(255).optional(),
    permissions: zod_1.z.array(zod_1.z.enum(["view", "add", "edit", "delete"])).min(1, "At least one permission is required").optional(),
    modules: zod_1.z.array(zod_1.z.enum(["/soa", "/role", "/users", "/customer-management", "/approvals"])).min(1, "At least one module is required").optional(),
});
exports.createCoordinatorSchema = zod_1.z.object({
    data: zod_1.z.object({
        first_name: zod_1.z.string().optional(),
        middle_name: zod_1.z.string().optional(),
        last_name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().or(zod_1.z.string().min(1, "Email is required")),
        contact_number: zod_1.z.string().min(1, "Contact number is required"),
        address: zod_1.z.string().optional(),
    }),
    roleIds: zod_1.z.array(zod_1.z.number()).min(1, "At least one role is required")
});
exports.coorSchemaUpdate = zod_1.z.object({
    first_name: zod_1.z.string().optional(),
    middle_name: zod_1.z.string().optional(),
    last_name: zod_1.z.string().optional(),
    contact_number: zod_1.z.string().min(1, "Contact number is required").optional(),
    address: zod_1.z.string().optional(),
});
exports.billCreationSchema = zod_1.z.object({
    fromDate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'fromDate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    toDate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'toDate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    dueDate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'dueDate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    nextDate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'nextDate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    billDate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'billDate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    readingDate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'readingDate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    kwhConsume: zod_1.z.number()
        .positive("kWh consumption must be a positive number"),
    rate: zod_1.z.number()
        .positive("Rate must be a positive number"),
    distribution: zod_1.z.number()
        .default(0),
    generation: zod_1.z.number()
        .default(0),
    sLoss: zod_1.z.number()
        .default(0),
    transmission: zod_1.z.number()
        .default(0),
    subsidies: zod_1.z.number()
        .default(0),
    gTax: zod_1.z.number()
        .default(0),
    fitAll: zod_1.z.number()
        .default(0),
    applied: zod_1.z.number()
        .default(0),
    other: zod_1.z.number()
        .default(0)
});
exports.updateCoordinatorSchema = zod_1.z.object({
    data: zod_1.z.object({
        first_name: zod_1.z.string().optional(),
        middle_name: zod_1.z.string().optional(),
        last_name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional().or(zod_1.z.string().min(1, "Email is required").optional()),
        contact_number: zod_1.z.string().min(1, "Contact number is required").optional(),
        address: zod_1.z.string().optional(),
    }),
    roleIds: zod_1.z.array(zod_1.z.number()).min(1, "At least one role is required").optional()
});
exports.userDataSchema = zod_1.z.object({
    first_name: zod_1.z.string().min(1, "First name is required"),
    middle_name: zod_1.z.string().optional().nullable(),
    last_name: zod_1.z.string().min(1, "Last name is required"),
    birthdate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'birthdate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)).optional().nullable(),
    email: zod_1.z.string().email("Invalid email format"),
    contact_number: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.string().optional().nullable(),
    role: zod_1.z.enum(['USER']).optional(),
    address: zod_1.z.string().optional().nullable()
});
exports.meterDataSchema = zod_1.z.object({
    meterNumber: zod_1.z.number().min(1, "Meter number must be valid"),
    meterAccountName: zod_1.z.string().optional(),
    meterAddress: zod_1.z.string().optional(),
    customerType: zod_1.z.string().optional(),
    meterActivated: zod_1.z.boolean().optional()
});
exports.userSchema = zod_1.z.object({
    first_name: zod_1.z.string().max(255),
    middle_name: zod_1.z.string().nullable().optional(),
    last_name: zod_1.z.string().max(255),
    birthdate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'birthdate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)),
    email: zod_1.z.string().email(),
    contact_number: zod_1.z.string().nullable().optional(),
    gender: zod_1.z.string().nullable().optional(),
    address: zod_1.z.string().max(255).nullable().optional(),
    password: zod_1.z.string().min(8)
});
exports.custUpdateSchema = zod_1.z.object({
    first_name: zod_1.z.string().optional(),
    middle_name: zod_1.z.string().optional(),
    last_name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    contact_number: zod_1.z.string(),
    address: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    birthdate: zod_1.z.string()
        .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'birthdate'. Expected format: YYYY-MM-DD")
        .transform(val => new Date(val)).optional(),
});
//# sourceMappingURL=validationSchemas.js.map
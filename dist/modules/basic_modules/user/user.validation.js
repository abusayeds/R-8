"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserValidation = exports.loginValidation = void 0;
const zod_1 = require("zod");
exports.loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "email is required!",
            invalid_type_error: "email must be a string",
        })
            .email(),
        password: zod_1.z.string({
            required_error: "password is required!",
            invalid_type_error: "password must be a string",
        }),
    }),
});
exports.registerUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required!",
            invalid_type_error: "name must be a string",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required!",
            invalid_type_error: "Email must be a string",
        })
            .email("Invalid email format!"),
        password: zod_1.z
            .string({
            required_error: "password is required!",
            invalid_type_error: "password must be a string",
        })
            .min(6, "Password must be at least 6 characters long"),
    }),
});

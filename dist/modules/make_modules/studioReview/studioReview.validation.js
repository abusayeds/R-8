"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudioReviewValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createStudioReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        studioId: zod_1.z.string({
            required_error: "studioId is required!",
            invalid_type_error: "studioId must be a valid string",
        }).refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid ObjectId format",
        }),
        reputation: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Reputation must be an integer" }),
        price: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Price must be an integer" }),
        location: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Location must be an integer" }),
        parking: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Parking must be an integer" }),
        socks: zod_1.z.boolean({ message: 'Must be a boolean.' }),
        validateParking: zod_1.z.boolean({ message: 'Must be a boolean.' }),
        atmosphere: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Atmosphere must be an integer" }),
        availability: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Availability must be an integer" }),
        cleanliness: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Cleanliness must be an integer" }),
        equipment: zod_1.z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Equipment must be an integer" }),
        gracePeriod: zod_1.z.number()
            .min(1).max(5, { message: 'Grace period must between 1 and 5.' })
            .int({ message: "Grace period must be an integer" })
    })
});

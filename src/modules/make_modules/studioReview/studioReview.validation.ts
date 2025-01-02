import { z } from 'zod';
import { Types } from 'mongoose';

export const createStudioReviewValidation = z.object({
    body: z.object({
        studioId: z.string({
            required_error: "studioId is required!",
            invalid_type_error: "studioId must be a valid string",
        }).refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid ObjectId format",
        }),
        reputation: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Reputation must be an integer" }),
        price: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Price must be an integer" }),
        location: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Location must be an integer" }),
        parking: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Parking must be an integer" }),
        socks: z.boolean({ message: 'Must be a boolean.' }),
        validateParking: z.boolean({ message: 'Must be a boolean.' }),
        atmosphere: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Atmosphere must be an integer" }),
        availability: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Availability must be an integer" }),
        cleanliness: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Cleanliness must be an integer" }),
        equipment: z.number()
            .min(1).max(5, { message: 'Rating must be between 1 and 5.' })
            .int({ message: "Equipment must be an integer" }),
        gracePeriod: z.number()
            .min(1).max(5, { message: 'Grace period must between 1 and 5.' })
            .int({ message: "Grace period must be an integer" })
    })
});

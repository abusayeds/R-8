import { z } from "zod";

export const createStudioValidation = z.object({
    body: z.object({
        studioName: z.string().min(1, { message: "Studio name is required" }),
        neighborhood: z.string().min(1, { message: "Neighborhood is required" }),
        studioCity: z.string().min(1, { message: "Studio city is required" }),
    })
});


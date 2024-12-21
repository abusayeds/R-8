import { Types } from "mongoose";
import { z } from "zod";

export const ctrateTrainerReviewValidation = z.object({
    body: z.object({
        trainerId: z.string({
            required_error: "trainerId  is required!",
            invalid_type_error: "trainerId must be a valid string",
        }).refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid ObjectId format",
        }),
        userId: z.string({
            required_error: "userId  is required!",
            invalid_type_error: "userId must be a valid string",
        }).refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid ObjectId format",
        }),

        trainerRate: z.number({
            required_error: "trainerRate is required!",
            invalid_type_error: "trainerRate must be a number",
        })
            .int({ message: "trainerRate must be an integer" })
            .min(1, { message: "trainerRate cannot be less than 1" })
            .max(5, { message: "trainerRate cannot be greater than 5" }),

        diffcultTrainer: z.number({
            required_error: "diffcultTrainer  is required!",
            invalid_type_error: "diffcultTrainer must be a number",
        }).int({ message: "trainerRate must be an integer" })
        .min(1, { message: "diffcultTrainer cannot be less than 1" })
            .max(5, { message: "diffcultTrainer cannot be greater than 5" }),

        takeClass: z.boolean({
            required_error: "takeClass is required!",
            invalid_type_error: "takeClass must be a  boolean",
        }),
        freeClass: z.boolean({
            required_error: "freeClass is required!",
            invalid_type_error: "freeClass must be a  boolean",
        }),

        musicChoice: z.number({
            required_error: "musicChoice  is required!",
            invalid_type_error: "musicChoice must be a number",
        })
            .int({ message: "trainerRate must be an integer" })
            .min(1, { message: "musicChoice cannot be less than 1" })
            .max(5, { message: "musicChoice cannot be greater than 5" }),

        tags: z.array(z.string({
            required_error: "tags  is required!",
            invalid_type_error: "tags must be a array",
        }))
            .length(3, { message: "tags must contain exactly 3 values" })
    })
});

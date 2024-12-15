import { Types } from "mongoose";
import { z } from "zod";

export const ctrateTrainerValidation = z.object({
    body: z.object({
        studioId: z.string({
            required_error: "Studio ID is required!",
            invalid_type_error: "Studio ID must be a valid string",
          }).refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid ObjectId format",
          }),
          
          firstName: z.string({
            required_error: "First name is required!",
            invalid_type_error: "First name must be a string",
          }).min(1, { message: "First name cannot be empty" }),
          
          lastName: z.string({
            required_error: "Last name is required!",
            invalid_type_error: "Last name must be a string",
          }).min(1, { message: "Last name cannot be empty" }),
          trainingType: z.enum(
            ["Heated Yoga", "Pilates", "Lagree", "Boxing", "HILT", "Other"],
            {
              errorMap: (issue) => {
                if (issue.code === "invalid_type") {
                  return {
                    message: "Training type is required!",
                  };
                }
                
                return { message: "Training type must be one of the following: Heated Yoga, Pilates, Lagree, Boxing, HILT, or Other." }; // Default message for other cases
              },
            }
          ),
    })
});


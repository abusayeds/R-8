import { z } from "zod";
export const loginValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required!",
        invalid_type_error: "email must be a string",
      })
      .email(),
    password: z.string({
      required_error: "password is required!",
      invalid_type_error: "password must be a string",
    }),
  }),
});

export const registerUserValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required!",
      invalid_type_error: "name must be a string",
    }),
    email: z
      .string({
        required_error: "Email is required!",
        invalid_type_error: "Email must be a string",
      })
      .email("Invalid email format!"),
    password: z
      .string({
        required_error: "password is required!",
        invalid_type_error: "password must be a string",
      })
      .min(6, "Password must be at least 6 characters long"),
  }),
});



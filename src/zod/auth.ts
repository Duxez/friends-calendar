import { z } from "zod";

const passwordSchema = z.string().min(8).max(72);

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const RegisterUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string().min(8).max(72),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type CredentialsInput = z.infer<typeof CredentialsSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

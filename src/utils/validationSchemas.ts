import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string(),
})
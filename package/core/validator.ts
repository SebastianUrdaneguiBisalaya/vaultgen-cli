import { z } from "zod";

export const CredentialSchema = z.object({
    service: z.string().min(1, "Service name is required."),
    account: z.string().optional(),
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
});

export type CredentialInput = z.infer<typeof CredentialSchema>;
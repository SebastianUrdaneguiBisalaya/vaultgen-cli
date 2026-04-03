import { z } from "zod";

export const CredentialSchema = z.object({
    service: z.string().min(1, "Service name is required."),
    account: z.string().optional(),
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
});


export function analyzePassword(pwd: string): { score: number, isWeak: boolean, suggestion: string } {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[A-Za-z0-9]/.test(pwd);
    const isLong = pwd.length >= 12;
    const score = [hasUpper, hasLower, hasNumber, hasSymbol, isLong].filter(Boolean).length;
    return {
        score,
        isWeak: score < 4,
        suggestion: "Universal pattern: 12+ chars, mix of A-Z, a-z, 0-9, and symbols (!@#S"
    }
}
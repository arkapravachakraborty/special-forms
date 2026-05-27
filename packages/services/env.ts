import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(16).describe("Secret for JWT signing and verification")
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);

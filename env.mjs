import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL_DEV: z.string().url(),
    DATABASE_URL_MAIN: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string().max(10),
    CLOUDINARY_API_KEY: z.string().min(10),
    CLOUDINARY_API_SECRET: z.string().min(12),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
    DATABASE_URL_MAIN: process.env.DATABASE_URL_MAIN,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
})

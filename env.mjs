import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL_DEV: z.string().url(),
    DATABASE_URL_MAIN: z.string().url(),
    DEEPAI_API_KEY: z.string().min(20),
    STABILITY_API_KEY: z.string().min(20),
    CLERK_SECRET_KEY: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string().max(10),
    CLOUDINARY_API_KEY: z.string().min(10),
    CLOUDINARY_API_SECRET: z.string().min(12),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().max(10),
    NEXT_PUBLIC_UPLOAD_PRESET: z.string().max(16),
  },
  runtimeEnv: {
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
    DATABASE_URL_MAIN: process.env.DATABASE_URL_MAIN,
    DEEPAI_API_KEY: process.env.DEEPAI_API_KEY,
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_UPLOAD_PRESET: process.env.NEXT_PUBLIC_UPLOAD_PRESET,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
})

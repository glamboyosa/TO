import crypto from "crypto"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSHA1 = (data: string) => {
  const hash = crypto.createHash("sha256")
  hash.update(data)
  return hash.digest("hex")
}

export const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = Date.now()
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
}

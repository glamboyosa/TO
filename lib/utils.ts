import crypto from "crypto"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSHA1 = (data: any) => {
  const hash = crypto.createHash("sha1")
  hash.update(data)
  return hash.digest("hex")
}

export const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime()
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
}

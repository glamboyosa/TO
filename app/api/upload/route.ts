import { NextResponse } from "next/server"
import { env } from "@/env.mjs"
import { v2 } from "cloudinary"

export async function PUT(request: Request) {
  const cloudinary = v2
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })
  try {
    const form = await request.formData()
    const fileDataURI = form.get("file") as string
    const publicId = form.get("fileName") as string

    const res = await cloudinary.uploader.upload(fileDataURI, {
      public_id: publicId,
    })

    return NextResponse.json({ secureURL: res.secure_url, url: res.url })
  } catch (e) {
    return new Response(`Something went wrong ${JSON.stringify(e)}`, {
      status: 400,
    })
  }
}

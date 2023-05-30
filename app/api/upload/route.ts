import { NextResponse } from "next/server"
import { env } from "@/env.mjs"
import FormData from "form-data"

import { ImageAIResult } from "@/types/enhancer"

export const runtime = "edge"

export async function POST(request: Request) {
  const engineId = "esrgan-v1-x2plus"
  const formData = new FormData()
  try {
    const { cloudinaryURL }: { cloudinaryURL: string } = await request.json()
    console.log(cloudinaryURL)
    formData.append("image", cloudinaryURL)
    // formData.append("width", 1024)

    const response = await fetch(
      `https://api.stability.ai/v1/generation/${engineId}/image-to-image/upscale`,
      {
        method: "POST",
        headers: {
          ...formData.getHeaders(),
          Accept: "image/png",
          Authorization: `Bearer ${env.STABILITY_API_KEY}`,
        },
        body: formData as any,
      }
    )
    const imageBuffer = await response.arrayBuffer()

    const imageBlob = new Blob([imageBuffer])

    const image = "data:image/png;base64," + imageBlob
    console.log(image)

    return NextResponse.json({ input_url: cloudinaryURL, output_url: image })
  } catch (e) {
    console.log(e)
    return new Response(`Something went wrong ${JSON.stringify(e)}`, {
      status: 400,
    })
  }
}

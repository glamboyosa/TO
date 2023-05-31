import { NextResponse } from "next/server"
import { env } from "@/env.mjs"
import FormData from "form-data"

import { ImageAIResult } from "@/types/enhancer"
import { writeFile } from "fs"

//export const runtime = "edge"

export async function POST(request: Request) {
  const engineId = "esrgan-v1-x2plus"
  const formData = new FormData()
  try {
    const { cloudinaryURL }: { cloudinaryURL: string } = await request.json()
    const buf = Buffer.from(cloudinaryURL, "base64")
    console.log(cloudinaryURL)
    console.log(buf)

    formData.append("image", buf)
    formData.append("width", 1024)

    const response = await fetch(
      `https://api.stability.ai/v1/generation/${engineId}/image-to-image/upscale`,
      {
        method: "POST",
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${env.STABILITY_API_KEY}`,
          Accept: "image/png",
          "Content-Type": "multipart/form-data",
        },
        body: formData as any,
      }
    )
    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`)
    }
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

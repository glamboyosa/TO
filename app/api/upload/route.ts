
import { NextResponse } from "next/server"
import { env } from "@/env.mjs"
import Replicate from "replicate"

import { ImageAIResult } from "@/types/enhancer"

//export const runtime = "edge"
const replicate = new Replicate({
  auth: env.REPLICATE_API_KEY,
})
const model =
  "jingyunliang/swinir:660d922d33153019e8c263a3bba265de882e7f4f70396546b6c9c8f9d47a021a"
const model2 =
  "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b"
export async function POST(request: Request) {
  try {
    const { cloudinaryURL }: { cloudinaryURL: string } = await request.json()
    const output = await replicate.run(model2, {
      input: {
        image: cloudinaryURL,
      },
    })
    console.log(output)
    return NextResponse.json({
      input_url: cloudinaryURL,
      output_url: output,
    })
  } catch (e) {
    console.log(e)
    return new Response(`Something went wrong ${JSON.stringify(e)}`, {
      status: 400,
    })
  }
}

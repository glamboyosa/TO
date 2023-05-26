import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("hi")
  try {
    const form = await request.formData()
    const url = form.get("cloudinaryURL") as string

    console.log(console.log(form))

    return NextResponse.json({ url })
  } catch (e) {
    return new Response(`Something went wrong ${JSON.stringify(e)}`, {
      status: 400,
    })
  }
}

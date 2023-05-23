import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "edge"

export async function PUT(request: Request) {
  const form = await request.formData()
  const file = form.get("file") as File
  const { url } = await put(file.name, file, { access: "public" })

  return NextResponse.json({ url })
}

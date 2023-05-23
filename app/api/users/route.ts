import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs"

import { freeCreditsExpiry } from "@/lib/helpers/freeCreditsExpiry"
import { prismaClient } from "@/lib/prisma"

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }
  try {
    const user = await currentUser()
    const freeCreditsExpiryDate = freeCreditsExpiry()
    await prismaClient.user.create({
      data: {
        email: user!.emailAddresses[0] as unknown as string,
        firstName: user?.firstName,
        lastName: user?.lastName,
        freeCreditsExpiry: freeCreditsExpiryDate,
      },
    })

    NextResponse.json({ success: true })
  } catch (error) {
    return new Response("Something went wrong", { status: 400 })
  }
}

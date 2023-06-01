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

    console.log(user)
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: user!.emailAddresses[0].emailAddress,
      },
    })
    if (existingUser) {
      console.log("user exists", existingUser)
      return NextResponse.json({
        success: true,
        user: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
        },
      })
    }
    await prismaClient.user.create({
      data: {
        email: user!.emailAddresses[0].emailAddress,
        firstName: user?.firstName,
        lastName: user?.lastName,
        freeCreditsExpiry: freeCreditsExpiryDate,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return new Response("Something went wrong", { status: 400 })
  }
}

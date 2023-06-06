import { NextResponse } from "next/server"

import { freeCreditsExpiry } from "@/lib/helpers/freeCreditsExpiry"
import { prismaClient } from "@/lib/prisma"

export async function GET() {
  const users = await prismaClient.user.findMany()
  const usersList: Boolean[] = []
  for (const user of users) {
    const freeCreditsExpiryDate = freeCreditsExpiry()
    const existingUserUpdated = await prismaClient.user.update({
      where: {
        email: user.email,
      },
      data: {
        freeCreditsCreatedAt: new Date(),
        freeCreditsExpiry: freeCreditsExpiryDate,
      },
      include: {
        paidCredits: true,
      },
    })

    existingUserUpdated ? usersList.concat(true) : usersList.concat(false)
  }

  if (usersList.every(Boolean) === true) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json(
      { success: false },
      {
        status: 400,
      }
    )
  }
}

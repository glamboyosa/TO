"use server"

import { prismaClient } from "@/lib/prisma"

prismaClient
export const decrementCredits = async (
  userMail: string
): Promise<{ creditsCount?: number; success: Boolean }> => {
  "use server"
  try {
    const currentUserWithCredits = await prismaClient.credits.findFirst({
      where: {
        user: {
          email: userMail,
        },
      },
    })

    const currentUser = await prismaClient.user.findFirst({
      where: {
        email: userMail,
      },
    })
    // IF FREE CREDITS OR PAID CREDITS ABOUT TO FINISH SEND EMAIL
    if (currentUserWithCredits === null) {
      const updatedUser = await prismaClient.user.update({
        where: {
          email: currentUser?.email,
        },
        data: {
          freeCredits: (currentUser?.freeCredits as number) - 1,
        },
      })

      return { creditsCount: updatedUser.freeCredits, success: true }
    } else {
      const updatedUserWithCredits = await prismaClient.credits.update({
        where: {
          userId: currentUserWithCredits.userId,
        },
        data: {
          number: currentUserWithCredits.number - 1,
        },
      })

      return { creditsCount: updatedUserWithCredits.number, success: true }
    }
  } catch (e) {
    return { success: false }
  }
}

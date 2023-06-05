"use server"

import NoCredits from "@/emails/no-credits"
import { env } from "env.mjs"
import { Resend } from "resend"

import { prismaClient } from "@/lib/prisma"

export const decrementCredits = async (
  userMail: string
): Promise<{ creditsCount?: number; success: Boolean }> => {
  "use server"

  const resend = new Resend(env.RESEND_API_KEY)

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
      if (currentUser?.freeCredits === 0) {
        const data = await resend.sendEmail({
          from: "onboarding@resend.dev",
          to: currentUser.email,
          subject: "No free credits left",
          react: NoCredits({
            firstName: currentUser.firstName as string,
            newFreeCreditsDate: currentUser.freeCreditsExpiry,
          }),
        })
        return { creditsCount: 0, success: false }
      }
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

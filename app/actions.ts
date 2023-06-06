"use server"

import NoCredits from "@/emails/no-credits"
import { env } from "env.mjs"
import { Resend } from "resend"

import { prismaClient } from "@/lib/prisma"
import { generateSHA1, generateSignature } from "@/lib/utils"

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
          from:
            process.env.NODE_ENV === "development"
              ? "onboarding@resend.dev"
              : "osa@glamboyosa.xyz",
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

export const deleteImagefromCloudinary = async (publicId: string) => {
  "use server"
  const cloudName = env.CLOUDINARY_CLOUD_NAME
  const timestamp = new Date().getTime()
  const apiKey = env.CLOUDINARY_API_KEY
  const apiSecret = env.CLOUDINARY_API_SECRET
  const signature = generateSHA1(generateSignature(publicId, apiSecret))
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
  const body = {
    public_id: publicId,
    signature: signature,
    api_key: apiKey,
    timestamp: timestamp,
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (response.ok) {
      return true
    }
  } catch (e) {
    console.error(e)
    return false
  }
}

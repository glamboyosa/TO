import { NextResponse } from "next/server"
import SignUpEmail from "@/emails/sign-up"
import { auth, currentUser } from "@clerk/nextjs"
import { env } from "env.mjs"
import { Resend } from "resend"

import { freeCreditsExpiry } from "@/lib/helpers/freeCreditsExpiry"
import { prismaClient } from "@/lib/prisma"

const resend = new Resend(env.RESEND_API_KEY)

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }
  try {
    const user = await currentUser()
    const freeCreditsExpiryDate = freeCreditsExpiry()

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
    const newUser = await prismaClient.user.create({
      data: {
        email: user!.emailAddresses[0].emailAddress,
        firstName: user?.firstName,
        lastName: user?.lastName,
        freeCreditsExpiry: freeCreditsExpiryDate,
      },
    })
    if (newUser) {
      const data = await resend.sendEmail({
        from:
          process.env.NODE_ENV === "development"
            ? "onboarding@resend.dev"
            : "osa@glamboyosa.xyz",
        to: newUser.email,
        subject: "Thank you for signing up!",
        react: SignUpEmail({ firstName: newUser.firstName as string }),
      })
      console.log(data)
    }
    return NextResponse.json({
      success: true,
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.log(error)
    return new Response("Something went wrong", { status: 400 })
  }
}

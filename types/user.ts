import { Prisma } from "@prisma/client"

export type PrismaUser = Prisma.UserGetPayload<{
  include: {
    paidCredits: true
  }
}>
export interface UserAuthType {
  success: boolean
  user: PrismaUser
}

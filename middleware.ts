import { authMiddleware } from "@clerk/nextjs"

import { siteConfig } from "./config/site"

export default authMiddleware()

export const config = {
  matcher: [siteConfig.links.enhancer],
}

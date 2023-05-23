import { authMiddleware } from "@clerk/nextjs"

import { siteConfig } from "./config/site"

export default authMiddleware({
  publicRoutes: [siteConfig.links.home, siteConfig.links.credits],
})

export const config = {
  matcher: [siteConfig.links.enhancer],
}

import { authMiddleware } from "@clerk/nextjs/server"

import { siteConfig } from "./config/site"

export default authMiddleware({
  publicRoutes: [siteConfig.links.home],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

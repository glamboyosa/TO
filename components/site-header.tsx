"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { useTheme } from "next-themes"

import useActiveTab, { Tabs } from "@/lib/store/useActiveTab"
import { ThemeToggle } from "@/components/theme-toggle"

const tabs = [
  { id: "home", label: "Home", link: "/" },
  { id: "enhancer", label: "Enhancer", link: "/enhancer" },
]
export function SiteHeader() {
  const activeTab = useActiveTab((state) => state.activeTab)
  const setActiveTab = useActiveTab((state) => state.setActiveTab)
  const { resolvedTheme: theme } = useTheme()
  const { isSignedIn, isLoaded } = useUser()

  const [arbitrary, setArbitrary] = useState(false)

  // basically when the UI mounts changes we wanna force a re-render for the dark / light mode to be in sync
  //

  useEffect(() => {
    if (window.location.pathname === "/") {
      setActiveTab("home")
    } else {
      setActiveTab("enhancer")
    }
    setArbitrary(!arbitrary)
  }, [])

  // TO-DO NAVIGATION
  if (!arbitrary) {
    return null
  }

  return (
    // eslint-disable-next-line tailwindcss/classnames-order
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } fixed top-[1vh] z-20 w-auto rounded-md p-2 font-serif  shadow-xl xl:top-[5vh]`}
    >
      <div className="cursor flex space-x-6">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.link}>
            <button
              onClick={() => {
                setActiveTab(tab.id as Tabs)
              }}
              className={`relative  rounded-full px-3 py-1.5 text-sm font-medium  outline-sky-400 transition focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="bubble"
                  className={`absolute inset-0 z-10 bg-pink ${
                    theme === "light" ? "mix-blend-darken" : "mix-blend-lighten"
                  }`}
                  style={{ borderRadius: 9999 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          </Link>
        ))}
        <div className="cursor flex items-center space-x-6">
          {
            <Link
              target="_blank"
              rel="noreferrer"
              href={"https://github.com/glamboyosa/to"}
            >
              <Github />
            </Link>
          }
          {isSignedIn && isLoaded && (
            <UserButton
              appearance={
                theme === "dark"
                  ? {
                      baseTheme: dark,
                      elements: {
                        card: "font-sans",
                      },
                    }
                  : {}
              }
            />
          )}
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}

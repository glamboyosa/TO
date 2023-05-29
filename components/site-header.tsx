"use client"

import { useLayoutEffect, useState } from "react"
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useLocalStorage } from "react-use"

import useActiveTab, { Tabs } from "@/lib/store/useActiveTab"
import { ThemeToggle } from "@/components/theme-toggle"

const tabs = [
  { id: "home", label: "Home", link: "/" },
  { id: "Enhancer", label: "Enhancer", link: "/enhancer" },
  { id: "credits", label: "Credits", link: "/credits" },
]
export function SiteHeader() {
  const activeTab = useActiveTab((state) => state.activeTab)
  const setActiveTab = useActiveTab((state) => state.setActiveTab)
  const { theme, setTheme } = useTheme()
  const { isSignedIn, isLoaded } = useUser()
  const [arbitrary, setArbitrary] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useLocalStorage(
    "activeTab",
    activeTab
  )
  // basically when the UI mounts changes we wanna force a re-render for the dark / light mode to be in sync
  //

  useLayoutEffect(() => {
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
        theme === "undefined"
          ? "bg-white"
          : theme === "light"
          ? "bg-white"
          : "bg-black"
      } fixed top-[1vh] z-20 w-auto  rounded-md p-2 font-serif  shadow-xl xl:top-[5vh]`}
    >
      <div className="cursor flex space-x-6">
        {tabs.map((tab) => (
          <Link href={tab.link}>
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as Tabs)
                setLocalStorageValue(tab.id as Tabs)
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
                    theme === undefined
                      ? "mix-blend-lighten"
                      : theme === "light"
                      ? "mix-blend-darken"
                      : "mix-blend-lighten"
                  }`}
                  style={{ borderRadius: 9999 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          </Link>
        ))}
        {isSignedIn && isLoaded && (
          <UserButton
            appearance={theme === "dark" ? { baseTheme: dark } : {}}
          />
        )}
        <ThemeToggle />
      </div>
    </div>
  )
}

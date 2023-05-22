"use client"

import { useEffect } from "react"
import Link from "next/link"
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
  const { theme } = useTheme()
  const [localStorageValue, setLocalStorageValue] = useLocalStorage(
    "activeTab",
    activeTab
  )
  useEffect(() => {
    //
  }, [theme])
  // TO-DO NAVIGATION
  console.log(theme)
  return (
    // eslint-disable-next-line tailwindcss/classnames-order
    <div
      className={`${
        theme === undefined
          ? "bg-white"
          : theme === "light"
          ? "bg-white"
          : "bg-black"
      } fixed top-[1vh] z-20 w-auto  rounded-md p-2 font-serif  shadow-xl xl:top-[5vh]`}
    >
      <div className="cursor flex space-x-6">
        {tabs.map((tab) => (
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
                    ? "mix-blend-darken"
                    : theme === "light"
                    ? "mix-blend-darken"
                    : "mix-blend-lighten"
                }`}
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Link href={tab.link}>{tab.label}</Link>
          </button>
        ))}
        <ThemeToggle />
      </div>
    </div>
  )
}

import { create } from "zustand"

export type Tabs = "home" | "enhancer" | "credits"
interface ActiveTabState {
  activeTab: Tabs
  setActiveTab: (tab: Tabs) => void
}

const useActiveTab = create<ActiveTabState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set(() => ({ activeTab: tab })),
}))
export default useActiveTab

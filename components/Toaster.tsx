"use client"

import { useEffect } from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { useToast } from "./ui/use-toast"

type ToasterProps = {}

const Toaster: React.FC<ToasterProps> = () => {
  const { toasts, toast } = useToast()
  useEffect(() => {
    toast({
      title: "100% Private",
      description:
        "We delete your images the moment you download it and every 24h.",
    })
  }, [])
  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export default Toaster

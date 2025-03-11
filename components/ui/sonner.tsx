'use client'
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-blue-500 group-[.toaster]:text-white group-[.toaster]:border-blue-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-200",
          actionButton:
            "group-[.toast]:bg-green-500 group-[.toast]:text-white font-medium",
          cancelButton:
            "group-[.toast]:bg-red-500 group-[.toast]:text-white font-medium",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useSound } from "../hooks/use-sound"
import { cn } from "@/lib/utils"

interface SoundButtonProps {
  children: React.ReactNode
  soundType?: "click" | "success" | "error" | "notification" | "coinCollect" | "buttonClick" | "spin" | "bonus"
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export default function SoundButton({
  children,
  soundType = "buttonClick",
  onClick,
  className,
  variant = "default",
  size = "default",
  disabled = false,
}: SoundButtonProps) {
  const { playSound, isEnabled } = useSound()

  const handleClick = () => {
    if (isEnabled && !disabled) {
      playSound(soundType)
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={disabled} className={cn(className)}>
      {children}
    </Button>
  )
}

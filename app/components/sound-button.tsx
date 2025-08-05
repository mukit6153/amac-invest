"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useSound } from "@/app/hooks/use-sound"
import { Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

interface SoundButtonProps {
  children: React.ReactNode
  soundType?: "click" | "success" | "error" | "notification" | "spin" | "reward"
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  onClick?: () => void
}

export default function SoundButton({
  children,
  soundType = "click",
  className,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  ...props
}: SoundButtonProps) {
  const { playSound, toggleSound, isEnabled } = useSound()

  const handleClick = () => {
    if (!disabled) {
      playSound(soundType)
      onClick?.()
    }
  }

  return (
    <Button className={className} variant={variant} size={size} disabled={disabled} onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

export function SoundToggleButton() {
  const { toggleSound, isEnabled } = useSound()
  const [soundEnabled, setSoundEnabled] = useState(isEnabled)

  const handleToggle = () => {
    const newState = toggleSound()
    setSoundEnabled(newState)
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} className="text-white hover:bg-white/20">
      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </Button>
  )
}

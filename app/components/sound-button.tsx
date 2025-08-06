"use client"

import { Button } from "@/components/ui/button"
import { useSound } from "@/app/hooks/use-sound"
import { Volume2, VolumeX } from 'lucide-react'
import { cn } from "@/lib/utils"

export interface SoundButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  soundType?: "click" | "success" | "error" | "notification" | "spin" | "reward"
  disabled?: boolean
  className?: string
  showSoundIcon?: boolean
}

export function SoundButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  soundType = "click",
  disabled = false,
  className,
  showSoundIcon = false,
  ...props
}: SoundButtonProps) {
  const { playSound, isSoundEnabled, toggleSound } = useSound()

  const handleClick = () => {
    if (!disabled) {
      playSound(soundType)
      onClick?.()
    }
  }

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSound()
  }

  return (
    <div className="relative inline-block">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled}
        className={cn(className)}
        {...props}
      >
        {children}
      </Button>
      
      {showSoundIcon && (
        <button
          onClick={handleSoundToggle}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors"
          aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-3 h-3" />
          ) : (
            <VolumeX className="w-3 h-3" />
          )}
        </button>
      )}
    </div>
  )
}

// Named export for compatibility
export { SoundButton as default }

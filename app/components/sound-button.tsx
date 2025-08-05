"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useSound } from "../hooks/use-sound"
import { forwardRef } from "react"

interface SoundButtonProps extends React.ComponentProps<typeof Button> {
  soundType?: "click" | "success" | "error" | "notification"
}

const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ onClick, soundType = "click", children, ...props }, ref) => {
    const { sounds } = useSound()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Play sound based on type
      switch (soundType) {
        case "success":
          sounds.success()
          break
        case "error":
          sounds.error()
          break
        case "notification":
          sounds.notification()
          break
        default:
          sounds.buttonClick()
      }

      // Call original onClick if provided
      if (onClick) {
        onClick(e)
      }
    }

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    )
  },
)

SoundButton.displayName = "SoundButton"

export { SoundButton }

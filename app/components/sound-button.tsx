"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useSound } from "../hooks/use-sound"
import { forwardRef } from "react"

interface SoundButtonProps extends React.ComponentProps<typeof Button> {
  soundType?: "buttonClick" | "success" | "error" | "notification"
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ onClick, soundType = "buttonClick", children, ...props }, ref) => {
    const { sounds } = useSound()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      sounds[soundType]()
      onClick?.(event)
    }

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    )
  },
)

SoundButton.displayName = "SoundButton"

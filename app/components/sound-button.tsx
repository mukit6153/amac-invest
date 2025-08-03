"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useSound } from "../hooks/use-sound"
import { useHaptic } from "../hooks/use-haptic"
import { forwardRef } from "react"

interface SoundButtonProps extends React.ComponentProps<typeof Button> {
  soundType?: "click" | "success" | "error" | "hover"
  enableHoverSound?: boolean
  enableHaptic?: boolean
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  (
    { children, onClick, onMouseEnter, soundType = "click", enableHoverSound = true, enableHaptic = true, ...props },
    ref,
  ) => {
    const { sounds } = useSound()
    const { hapticFeedback } = useHaptic()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundType === "click") sounds.buttonClick()
      else if (soundType === "success") sounds.success()
      else if (soundType === "error") sounds.error()

      if (enableHaptic) {
        if (soundType === "success") hapticFeedback.success()
        else if (soundType === "error") hapticFeedback.error()
        else hapticFeedback.click()
      }

      onClick?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableHoverSound && !props.disabled) {
        sounds.buttonHover()
        if (enableHaptic) hapticFeedback.light()
      }
      onMouseEnter?.(e)
    }

    return (
      <Button ref={ref} onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
        {children}
      </Button>
    )
  },
)

SoundButton.displayName = "SoundButton"

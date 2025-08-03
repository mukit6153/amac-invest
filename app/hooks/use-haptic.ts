"use client"

import { useCallback } from "react"

export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  const hapticFeedback = {
    light: () => vibrate(10),
    medium: () => vibrate(50),
    heavy: () => vibrate(100),
    success: () => vibrate([50, 50, 100]),
    error: () => vibrate([100, 50, 100, 50, 100]),
    notification: () => vibrate([200, 100, 200]),
    click: () => vibrate(25),
    spin: () => vibrate([100, 50, 100, 50, 100, 50, 200]),
    reward: () => vibrate([200, 100, 200, 100, 300]),
  }

  return { vibrate, hapticFeedback }
}

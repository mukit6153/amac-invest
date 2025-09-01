"use client"
import { useState, useEffect, useCallback, createContext, useContext } from "react"
import type React from "react"

type SoundType = "click" | "success" | "error" | "notification" | "coinCollect" | "spin" | "bonus"

interface SoundContextType {
  playSound: (type: SoundType) => void
  toggleSound: () => void
  isSoundEnabled: boolean
  isLoading: boolean
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

const generateBeep = (frequency: number, duration: number, type: "sine" | "square" | "triangle" = "sine") => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)

    return true
  } catch (error) {
    console.warn("Web Audio API not supported:", error)
    return false
  }
}

const soundPatterns: Record<SoundType, () => void> = {
  click: () => generateBeep(800, 0.1),
  success: () => {
    generateBeep(523, 0.15) // C5
    setTimeout(() => generateBeep(659, 0.15), 100) // E5
    setTimeout(() => generateBeep(784, 0.2), 200) // G5
  },
  error: () => {
    generateBeep(300, 0.2, "square")
    setTimeout(() => generateBeep(200, 0.3, "square"), 150)
  },
  notification: () => generateBeep(1000, 0.2),
  coinCollect: () => {
    generateBeep(1319, 0.1) // E6
    setTimeout(() => generateBeep(1568, 0.15), 80) // G6
  },
  spin: () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateBeep(400 + i * 100, 0.05), i * 50)
    }
  },
  bonus: () => {
    generateBeep(523, 0.1) // C5
    setTimeout(() => generateBeep(659, 0.1), 100) // E5
    setTimeout(() => generateBeep(784, 0.1), 200) // G5
    setTimeout(() => generateBeep(1047, 0.2), 300) // C6
  },
}

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      const storedSoundPreference = localStorage.getItem("isSoundEnabled")
      if (storedSoundPreference !== null) {
        setIsSoundEnabled(JSON.parse(storedSoundPreference))
      }
    } catch (error) {
      console.warn("Failed to load sound preference:", error)
    }
    setIsLoading(false)
  }, [])

  const playSound = useCallback(
    (type: SoundType) => {
      if (!isSoundEnabled || isLoading) return

      try {
        soundPatterns[type]()
      } catch (error) {
        console.warn(`Failed to play sound ${type}:`, error)
      }
    },
    [isSoundEnabled, isLoading],
  )

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const newState = !prev
      try {
        localStorage.setItem("isSoundEnabled", JSON.stringify(newState))
      } catch (error) {
        console.warn("Failed to save sound preference:", error)
      }
      return newState
    })
  }, [])

  const contextValue: SoundContextType = {
    playSound,
    toggleSound,
    isSoundEnabled,
    isLoading,
  }

  return <SoundContext.Provider value={contextValue}>{children}</SoundContext.Provider>
}

export const useSound = () => {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}

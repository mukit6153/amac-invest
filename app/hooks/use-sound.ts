"use client"

import { useState, useEffect, useCallback } from "react"

interface SoundHook {
  playSound: (type: string) => void
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  sounds: {
    buttonClick: () => void
    success: () => void
    error: () => void
    notification: () => void
    coinCollect: () => void
    spin: () => void
    bonus: () => void
  }
}

export function useSound(): SoundHook {
  const [isEnabled, setIsEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)
      }
    }

    document.addEventListener("click", initAudio, { once: true })
    document.addEventListener("touchstart", initAudio, { once: true })

    return () => {
      document.removeEventListener("click", initAudio)
      document.removeEventListener("touchstart", initAudio)
    }
  }, [audioContext])

  const createTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!audioContext || !isEnabled) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    },
    [audioContext, isEnabled]
  )

  const playSound = useCallback(
    (type: string) => {
      if (!isEnabled || !audioContext) return

      switch (type) {
        case "click":
        case "buttonClick":
          createTone(800, 0.1)
          break
        case "success":
          createTone(523, 0.2)
          setTimeout(() => createTone(659, 0.2), 100)
          setTimeout(() => createTone(784, 0.3), 200)
          break
        case "error":
          createTone(200, 0.5, "sawtooth")
          break
        case "notification":
          createTone(440, 0.2)
          setTimeout(() => createTone(554, 0.2), 150)
          break
        case "coinCollect":
          createTone(659, 0.1)
          setTimeout(() => createTone(784, 0.1), 50)
          setTimeout(() => createTone(988, 0.2), 100)
          break
        case "spin":
          createTone(330, 0.1)
          setTimeout(() => createTone(370, 0.1), 50)
          setTimeout(() => createTone(415, 0.1), 100)
          break
        case "bonus":
          createTone(523, 0.15)
          setTimeout(() => createTone(659, 0.15), 100)
          setTimeout(() => createTone(784, 0.15), 200)
          setTimeout(() => createTone(1047, 0.3), 300)
          break
        default:
          createTone(440, 0.1)
      }
    },
    [createTone, isEnabled, audioContext]
  )

  const sounds = {
    buttonClick: () => playSound("buttonClick"),
    success: () => playSound("success"),
    error: () => playSound("error"),
    notification: () => playSound("notification"),
    coinCollect: () => playSound("coinCollect"),
    spin: () => playSound("spin"),
    bonus: () => playSound("bonus"),
  }

  return {
    playSound,
    isEnabled,
    setIsEnabled,
    sounds,
  }
}

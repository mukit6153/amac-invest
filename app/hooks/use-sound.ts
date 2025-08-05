"use client"

import { useState, useEffect, useCallback } from "react"

interface SoundHook {
  sounds: {
    buttonClick: () => void
    success: () => void
    error: () => void
    notification: () => void
    coinCollect: () => void
    spinStart: () => void
    spinTick: () => void
    spinStop: () => void
    rewardSmall: () => void
    rewardBig: () => void
    levelUp: () => void
  }
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
}

export function useSound(): SoundHook {
  const [isEnabled, setIsEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context on user interaction
    const initAudio = () => {
      if (!audioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          setAudioContext(ctx)
        } catch (error) {
          console.warn("Audio context not supported:", error)
        }
      }
    }

    // Add event listeners for user interaction
    const events = ["click", "touchstart", "keydown"]
    events.forEach((event) => {
      document.addEventListener(event, initAudio, { once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, initAudio)
      })
    }
  }, [audioContext])

  const playSound = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!isEnabled || !audioContext) return

      try {
        if (audioContext.state === "suspended") {
          audioContext.resume()
        }

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
      } catch (error) {
        console.warn("Error playing sound:", error)
      }
    },
    [isEnabled, audioContext],
  )

  const sounds = {
    buttonClick: () => playSound(800, 0.1),
    success: () => {
      playSound(523, 0.2)
      setTimeout(() => playSound(659, 0.2), 100)
      setTimeout(() => playSound(784, 0.3), 200)
    },
    error: () => {
      playSound(300, 0.1)
      setTimeout(() => playSound(250, 0.2), 100)
    },
    notification: () => {
      playSound(800, 0.1)
      setTimeout(() => playSound(1000, 0.1), 100)
    },
    coinCollect: () => {
      playSound(1000, 0.1)
      setTimeout(() => playSound(1200, 0.1), 50)
      setTimeout(() => playSound(1500, 0.2), 100)
    },
    spinStart: () => {
      playSound(400, 0.2)
      setTimeout(() => playSound(500, 0.2), 100)
    },
    spinTick: () => playSound(600, 0.05),
    spinStop: () => {
      playSound(300, 0.3)
      setTimeout(() => playSound(200, 0.2), 200)
    },
    rewardSmall: () => {
      playSound(523, 0.15)
      setTimeout(() => playSound(659, 0.15), 100)
    },
    rewardBig: () => {
      playSound(523, 0.2)
      setTimeout(() => playSound(659, 0.2), 100)
      setTimeout(() => playSound(784, 0.2), 200)
      setTimeout(() => playSound(1047, 0.4), 300)
    },
    levelUp: () => {
      const notes = [523, 587, 659, 698, 784, 880, 988]
      notes.forEach((note, index) => {
        setTimeout(() => playSound(note, 0.2), index * 100)
      })
    },
  }

  return {
    sounds,
    isEnabled,
    setIsEnabled,
  }
}

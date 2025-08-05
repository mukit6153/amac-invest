"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface SoundConfig {
  frequency: number
  duration: number
  type: OscillatorType
  volume: number
}

const soundConfigs: Record<string, SoundConfig> = {
  click: { frequency: 800, duration: 100, type: "sine", volume: 0.1 },
  success: { frequency: 600, duration: 200, type: "sine", volume: 0.15 },
  error: { frequency: 300, duration: 300, type: "sawtooth", volume: 0.1 },
  notification: { frequency: 1000, duration: 150, type: "triangle", volume: 0.1 },
  coinCollect: { frequency: 1200, duration: 200, type: "sine", volume: 0.12 },
  buttonClick: { frequency: 700, duration: 80, type: "square", volume: 0.08 },
  spin: { frequency: 400, duration: 500, type: "sine", volume: 0.1 },
  bonus: { frequency: 800, duration: 300, type: "triangle", volume: 0.15 },
}

export function useSound() {
  const [isEnabled, setIsEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    // Add event listeners for user interaction
    const events = ["click", "touchstart", "keydown"]
    events.forEach((event) => {
      document.addEventListener(event, initAudioContext, { once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, initAudioContext)
      })
    }
  }, [])

  const playSound = useCallback(
    (soundType: keyof typeof soundConfigs) => {
      if (!isEnabled || !audioContextRef.current) return

      const config = soundConfigs[soundType]
      if (!config) return

      try {
        const oscillator = audioContextRef.current.createOscillator()
        const gainNode = audioContextRef.current.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContextRef.current.destination)

        oscillator.frequency.setValueAtTime(config.frequency, audioContextRef.current.currentTime)
        oscillator.type = config.type

        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
        gainNode.gain.linearRampToValueAtTime(config.volume, audioContextRef.current.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + config.duration / 1000)

        oscillator.start(audioContextRef.current.currentTime)
        oscillator.stop(audioContextRef.current.currentTime + config.duration / 1000)
      } catch (error) {
        console.warn("Error playing sound:", error)
      }
    },
    [isEnabled],
  )

  const sounds = {
    click: () => playSound("click"),
    success: () => playSound("success"),
    error: () => playSound("error"),
    notification: () => playSound("notification"),
    coinCollect: () => playSound("coinCollect"),
    buttonClick: () => playSound("buttonClick"),
    spin: () => playSound("spin"),
    bonus: () => playSound("bonus"),
  }

  return {
    sounds,
    playSound,
    isEnabled,
    setIsEnabled,
  }
}

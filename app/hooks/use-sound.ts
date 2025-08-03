"use client"

import { useCallback, useRef, useEffect, useState } from "react"

interface SoundOptions {
  volume?: number
  loop?: boolean
  playbackRate?: number
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const soundCacheRef = useRef<Map<string, AudioBuffer>>(new Map())
  const activeSoundsRef = useRef<Set<AudioBufferSourceNode>>(new Set())
  const [isEnabled, setIsEnabled] = useState(true)

  // Initialize AudioContext
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        } catch (error) {
          console.warn("AudioContext not supported:", error)
        }
      }
    }

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudioContext()
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("touchstart", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)

      // Clean up active sounds
      activeSoundsRef.current.forEach((source) => {
        try {
          source.stop()
        } catch (e) {
          // Ignore errors when stopping already stopped sources
        }
      })
      activeSoundsRef.current.clear()
    }
  }, [])

  // Create audio buffer from frequency and duration
  const createTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine"): AudioBuffer | null => {
      if (!audioContextRef.current) return null

      try {
        const sampleRate = audioContextRef.current.sampleRate
        const numSamples = sampleRate * duration
        const buffer = audioContextRef.current.createBuffer(1, numSamples, sampleRate)
        const channelData = buffer.getChannelData(0)

        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate
          let sample = 0

          switch (type) {
            case "sine":
              sample = Math.sin(2 * Math.PI * frequency * t)
              break
            case "square":
              sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
              break
            case "triangle":
              sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
              break
            case "sawtooth":
              sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
              break
          }

          // Apply envelope (fade in/out)
          const envelope = Math.min(t * 10, (duration - t) * 10, 1)
          channelData[i] = sample * envelope * 0.3 // Reduce volume
        }

        return buffer
      } catch (error) {
        console.warn("Error creating tone:", error)
        return null
      }
    },
    [],
  )

  // Create complex sound effects
  const createComplexSound = useCallback(
    (soundType: string): AudioBuffer | null => {
      if (!audioContextRef.current) return null

      try {
        const sampleRate = audioContextRef.current.sampleRate
        let buffer: AudioBuffer
        let channelData: Float32Array

        switch (soundType) {
          case "spin-start":
            // Rising tone with some noise
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 0.5, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const frequency = 200 + t * 400 // Rising from 200Hz to 600Hz
              const sample = Math.sin(2 * Math.PI * frequency * t) * (1 - t) * 0.4
              channelData[i] = sample
            }
            break

          case "spin-tick":
            // Short click sound
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 0.1, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const envelope = Math.exp(-t * 50)
              const sample = (Math.random() * 2 - 1) * envelope * 0.3
              channelData[i] = sample
            }
            break

          case "spin-stop":
            // Descending tone
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 0.8, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const frequency = 600 - t * 400 // Descending from 600Hz to 200Hz
              const envelope = Math.exp(-t * 2)
              const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4
              channelData[i] = sample
            }
            break

          case "reward-big":
            // Celebration sound with multiple tones
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 1.5, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const envelope = Math.exp(-t * 1.5)
              const tone1 = Math.sin(2 * Math.PI * 523 * t) // C5
              const tone2 = Math.sin(2 * Math.PI * 659 * t) // E5
              const tone3 = Math.sin(2 * Math.PI * 784 * t) // G5
              const sample = (tone1 + tone2 + tone3) * envelope * 0.2
              channelData[i] = sample
            }
            break

          case "reward-small":
            // Simple pleasant tone
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 0.6, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const envelope = Math.exp(-t * 3)
              const sample = Math.sin(2 * Math.PI * 523 * t) * envelope * 0.3 // C5
              channelData[i] = sample
            }
            break

          case "button-hover":
            // Subtle hover sound
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 0.1, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const envelope = Math.exp(-t * 20)
              const sample = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.1
              channelData[i] = sample
            }
            break

          case "error":
            // Error buzz sound
            buffer = audioContextRef.current.createBuffer(1, sampleRate * 0.4, sampleRate)
            channelData = buffer.getChannelData(0)
            for (let i = 0; i < channelData.length; i++) {
              const t = i / sampleRate
              const envelope = Math.exp(-t * 5)
              const sample = Math.sin(2 * Math.PI * 150 * t) * envelope * 0.3
              channelData[i] = sample
            }
            break

          default:
            return createTone(440, 0.2)
        }

        return buffer
      } catch (error) {
        console.warn("Error creating complex sound:", error)
        return null
      }
    },
    [createTone],
  )

  // Play sound function
  const playSound = useCallback(
    (soundType: string, options: SoundOptions = {}) => {
      if (!isEnabled || !audioContextRef.current) return

      const { volume = 1, loop = false, playbackRate = 1 } = options

      try {
        // Resume audio context if suspended
        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume()
        }

        let buffer = soundCacheRef.current.get(soundType)

        if (!buffer) {
          // Create and cache the sound
          if (["click", "success", "notification"].includes(soundType)) {
            const frequencies: { [key: string]: number } = {
              click: 800,
              success: 523,
              notification: 659,
            }
            buffer = createTone(frequencies[soundType], 0.2)
          } else {
            buffer = createComplexSound(soundType)
          }

          if (buffer) {
            soundCacheRef.current.set(soundType, buffer)
          }
        }

        if (!buffer) return

        const source = audioContextRef.current.createBufferSource()
        const gainNode = audioContextRef.current.createGain()

        source.buffer = buffer
        source.playbackRate.value = playbackRate
        source.loop = loop

        gainNode.gain.value = volume * 0.5 // Master volume control

        source.connect(gainNode)
        gainNode.connect(audioContextRef.current.destination)

        // Track active sounds
        activeSoundsRef.current.add(source)

        source.onended = () => {
          activeSoundsRef.current.delete(source)
        }

        source.start()

        // Auto-stop after 5 seconds to prevent memory leaks
        setTimeout(() => {
          if (activeSoundsRef.current.has(source)) {
            try {
              source.stop()
            } catch (e) {
              // Ignore errors
            }
          }
        }, 5000)
      } catch (error) {
        console.warn("Sound playback failed:", error)
      }
    },
    [createTone, createComplexSound, isEnabled],
  )

  // Predefined sound effects
  const sounds = {
    buttonClick: () => playSound("click", { volume: 0.3 }),
    buttonHover: () => playSound("button-hover", { volume: 0.1 }),
    success: () => playSound("success", { volume: 0.4 }),
    error: () => playSound("error", { volume: 0.4 }),
    notification: () => playSound("notification", { volume: 0.3 }),
    spinStart: () => playSound("spin-start", { volume: 0.5 }),
    spinTick: () => playSound("spin-tick", { volume: 0.2 }),
    spinStop: () => playSound("spin-stop", { volume: 0.5 }),
    rewardSmall: () => playSound("reward-small", { volume: 0.4 }),
    rewardBig: () => playSound("reward-big", { volume: 0.6 }),
    coinCollect: () => playSound("success", { volume: 0.3, playbackRate: 1.5 }),
    levelUp: () => playSound("reward-big", { volume: 0.5, playbackRate: 0.8 }),
  }

  return { playSound, sounds, isEnabled, setIsEnabled }
}

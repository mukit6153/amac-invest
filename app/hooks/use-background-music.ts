"use client"

import { useCallback, useRef, useState } from "react"

export function useBackgroundMusic() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
    }
  }, [])

  const createAmbientTrack = useCallback((trackType: string): AudioBuffer => {
    if (!audioContextRef.current) return null as any

    const sampleRate = audioContextRef.current.sampleRate
    const duration = 30 // 30 seconds loop
    const buffer = audioContextRef.current.createBuffer(2, sampleRate * duration, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)

      for (let i = 0; i < channelData.length; i++) {
        const t = i / sampleRate
        let sample = 0

        switch (trackType) {
          case "peaceful":
            // Peaceful ambient with soft sine waves
            sample =
              Math.sin(2 * Math.PI * 220 * t) * 0.1 +
              Math.sin(2 * Math.PI * 330 * t) * 0.08 +
              Math.sin(2 * Math.PI * 440 * t) * 0.06
            sample *= Math.sin(t * 0.1) * 0.5 + 0.5 // Slow amplitude modulation
            break

          case "energetic":
            // More upbeat ambient
            sample =
              Math.sin(2 * Math.PI * 261.63 * t) * 0.08 + // C4
              Math.sin(2 * Math.PI * 329.63 * t) * 0.06 + // E4
              Math.sin(2 * Math.PI * 392 * t) * 0.04 // G4
            sample *= Math.sin(t * 0.2) * 0.6 + 0.4
            break

          case "focus":
            // Minimal focus-enhancing tones
            sample =
              Math.sin(2 * Math.PI * 174 * t) * 0.05 + // Healing frequency
              Math.sin(2 * Math.PI * 528 * t) * 0.03 // Love frequency
            sample *= Math.sin(t * 0.05) * 0.3 + 0.7
            break

          default:
            sample = 0
        }

        // Add some subtle noise for texture
        sample += (Math.random() * 2 - 1) * 0.01

        channelData[i] = sample * 0.3 // Keep volume low
      }
    }

    return buffer
  }, [])

  const playTrack = useCallback(
    (trackType: string) => {
      initAudioContext()

      if (!audioContextRef.current || !gainNodeRef.current) return

      // Stop current track
      if (sourceRef.current) {
        sourceRef.current.stop()
      }

      const buffer = createAmbientTrack(trackType)
      if (!buffer) return

      sourceRef.current = audioContextRef.current.createBufferSource()
      sourceRef.current.buffer = buffer
      sourceRef.current.loop = true
      sourceRef.current.connect(gainNodeRef.current)

      sourceRef.current.start()
      setIsPlaying(true)
      setCurrentTrack(trackType)
    },
    [initAudioContext, createAmbientTrack],
  )

  const stopMusic = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop()
      sourceRef.current = null
    }
    setIsPlaying(false)
    setCurrentTrack(null)
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume))
    }
  }, [])

  const musicTracks = {
    peaceful: () => playTrack("peaceful"),
    energetic: () => playTrack("energetic"),
    focus: () => playTrack("focus"),
  }

  return {
    playTrack,
    stopMusic,
    setVolume,
    isPlaying,
    currentTrack,
    musicTracks,
  }
}

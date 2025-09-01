"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"

type MusicTheme = "peaceful" | "energetic" | "focus"

interface MusicTrackMap {
  [key: string]: string
}

const musicFiles: MusicTrackMap = {
  peaceful: "/sounds/peaceful_music.mp3", // Placeholder for actual music files
  energetic: "/sounds/energetic_music.mp3",
  focus: "/sounds/focus_music.mp3",
}

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<MusicTheme | null>(null)
  const [volume, setVolumeInternal] = useState(0.3) // Default volume

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = volume

    // Load music preference from localStorage
    const storedMusicEnabled = localStorage.getItem("isMusicEnabled")
    const storedMusicVolume = localStorage.getItem("musicVolume")
    const storedMusicTheme = localStorage.getItem("musicTheme") as MusicTheme | null

    if (storedMusicVolume !== null) {
      setVolumeInternal(Number.parseFloat(storedMusicVolume))
      if (audioRef.current) {
        audioRef.current.volume = Number.parseFloat(storedMusicVolume)
      }
    }

    if (storedMusicEnabled === "true" && storedMusicTheme) {
      playMusic(storedMusicTheme)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const playMusic = useCallback((theme: MusicTheme) => {
    if (audioRef.current) {
      audioRef.current.src = musicFiles[theme]
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setCurrentTrack(theme)
          localStorage.setItem("isMusicEnabled", "true")
          localStorage.setItem("musicTheme", theme)
        })
        .catch((e) => console.error("Error playing music:", e))
    }
  }, [])

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      localStorage.setItem("isMusicEnabled", "false")
    }
  }, [])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic()
    } else {
      // If no current track, default to peaceful
      playMusic(currentTrack || "peaceful")
    }
  }, [isPlaying, currentTrack, playMusic, stopMusic])

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolumeInternal(newVolume)
      localStorage.setItem("musicVolume", newVolume.toString())
    }
  }, [])

  return {
    playMusic,
    stopMusic,
    toggleMusic,
    setVolume,
    isPlaying,
    currentTrack,
    volume,
    musicTracks: musicFiles, // Expose themes for selection
  }
}

export const BackgroundMusicProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children)
}

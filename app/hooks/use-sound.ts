'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

interface SoundContextType {
  playSound: (soundName: string) => void
  isSoundEnabled: boolean
  toggleSound: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

interface SoundProviderProps {
  children: ReactNode
}

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const audioCache = new Map<string, HTMLAudioElement>()

  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('isSoundEnabled')
    if (savedSoundSetting !== null) {
      setIsSoundEnabled(JSON.parse(savedSoundSetting))
    }
  }, [])

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      const newState = !prev
      localStorage.setItem('isSoundEnabled', JSON.stringify(newState))
      return newState
    })
  }, [])

  const playSound = useCallback((soundName: string) => {
    if (!isSoundEnabled) return

    const soundPath = `/sounds/${soundName}.mp3`

    let audio = audioCache.get(soundPath)
    if (!audio) {
      audio = new Audio(soundPath)
      audioCache.set(soundPath, audio)
    }

    // Play the sound, handling potential errors
    audio.currentTime = 0 // Reset to start for quick consecutive plays
    audio.play().catch(error => {
      console.error(`Error playing sound: ${error.message}`, error)
      // Optionally remove from cache if it consistently fails
      audioCache.delete(soundPath)
    })
  }, [isSoundEnabled])

  return (
    <SoundContext.Provider value={{ playSound, isSoundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSound = () => {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}

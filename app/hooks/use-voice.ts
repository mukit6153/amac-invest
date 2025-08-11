'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

interface VoiceContextType {
  speak: (text: string, options?: SpeechSynthesisUtteranceOptions) => void
  stop: () => void
  isSpeaking: boolean
  isVoiceEnabled: boolean
  toggleVoice: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void
  pitch: number
  setPitch: (pitch: number) => void
  rate: number
  setRate: (rate: number) => void
  volume: number
  setVolume: (volume: number) => void
}

interface SpeechSynthesisUtteranceOptions {
  lang?: string
  pitch?: number
  rate?: number
  volume?: number
  voice?: SpeechSynthesisVoice
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

interface VoiceProviderProps {
  children: ReactNode
}

export const VoiceProvider = ({ children }: VoiceProviderProps) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [pitch, setPitch] = useState(1) // 0.1 to 2
  const [rate, setRate] = useState(1) // 0.1 to 10
  const [volume, setVolume] = useState(1) // 0 to 1

  useEffect(() => {
    const savedVoiceSetting = localStorage.getItem('isVoiceEnabled')
    if (savedVoiceSetting !== null) {
      setIsVoiceEnabled(JSON.parse(savedVoiceSetting))
    }

    const savedVoiceURI = localStorage.getItem('selectedVoiceURI')
    const savedPitch = localStorage.getItem('voicePitch')
    const savedRate = localStorage.getItem('voiceRate')
    const savedVolume = localStorage.getItem('voiceVolume')

    if (savedPitch) setPitch(parseFloat(savedPitch))
    if (savedRate) setRate(parseFloat(savedRate))
    if (savedVolume) setVolume(parseFloat(savedVolume))

    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      if (savedVoiceURI) {
        const voice = availableVoices.find(v => v.voiceURI === savedVoiceURI)
        setSelectedVoice(voice || null)
      } else if (availableVoices.length > 0) {
        // Try to find a default English voice
        const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0]
        setSelectedVoice(defaultVoice)
        localStorage.setItem('selectedVoiceURI', defaultVoice.voiceURI)
      }
    }

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices
    }
    populateVoices() // Call initially
  }, [])

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('selectedVoiceURI', selectedVoice.voiceURI)
    }
  }, [selectedVoice])

  useEffect(() => {
    localStorage.setItem('voicePitch', pitch.toString())
  }, [pitch])

  useEffect(() => {
    localStorage.setItem('voiceRate', rate.toString())
  }, [rate])

  useEffect(() => {
    localStorage.setItem('voiceVolume', volume.toString())
  }, [volume])

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => {
      const newState = !prev
      localStorage.setItem('isVoiceEnabled', JSON.stringify(newState))
      if (!newState) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      }
      return newState
    })
  }, [])

  const speak = useCallback((text: string, options?: SpeechSynthesisUtteranceOptions) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.voice = options?.voice || selectedVoice
    utterance.pitch = options?.pitch || pitch
    utterance.rate = options?.rate || rate
    utterance.volume = options?.volume || volume
    utterance.lang = options?.lang || (selectedVoice ? selectedVoice.lang : 'en-US')

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [isVoiceEnabled, selectedVoice, pitch, rate, volume])

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return (
    <VoiceContext.Provider
      value={{
        speak,
        stop,
        isSpeaking,
        isVoiceEnabled,
        toggleVoice,
        voices,
        selectedVoice,
        setSelectedVoice,
        pitch,
        setPitch,
        rate,
        setRate,
        volume,
        setVolume,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider')
  }
  return context
}

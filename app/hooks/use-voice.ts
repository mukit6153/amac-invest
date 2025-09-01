"use client"

import React, { useState, useEffect, useCallback } from "react"

interface VoiceNotificationOptions {
  lang?: string
  pitch?: number
  rate?: number
  volume?: number
}

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynth(window.speechSynthesis)
      setIsSpeechSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      // Voices might not be immediately available
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
      loadVoices() // Initial load
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: VoiceNotificationOptions) => {
      if (!isSpeechSupported || !synth) {
        console.warn("Speech synthesis not supported or not initialized.")
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = options?.lang || "bn-BD" // Default to Bengali
      utterance.pitch = options?.pitch ? options.pitch / 100 : 1 // 0 to 2, default 1
      utterance.rate = options?.rate ? options.rate / 100 : 1 // 0.1 to 10, default 1
      utterance.volume = options?.volume ? options.volume / 100 : 1 // 0 to 1, default 1

      // Try to find a Bengali voice
      const bengaliVoice = voices.find((voice) => voice.lang === "bn-BD" || voice.lang.startsWith("bn-"))
      if (bengaliVoice) {
        utterance.voice = bengaliVoice
      } else {
        console.warn("Bengali voice not found, using default.")
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event)
        setIsSpeaking(false)
      }

      synth.speak(utterance)
    },
    [synth, isSpeaking, voices, isSpeechSupported],
  )

  const stop = useCallback(() => {
    if (synth && isSpeaking) {
      synth.cancel()
      setIsSpeaking(false)
    }
  }, [synth, isSpeaking])

  const voiceNotifications = {
    welcome: () => speak("এএমএসি ইনভেস্টমেন্ট অ্যাপে আপনাকে স্বাগতম।", { lang: "bn-BD" }),
    balanceUpdate: (amount: number) => speak(`আপনার ব্যালেন্স ${amount} টাকা আপডেট হয়েছে।`, { lang: "bn-BD" }),
    rewardClaimed: (reward: number) => speak(`অভিনন্দন! আপনি ${reward} টাকা পুরস্কার পেয়েছেন।`, { lang: "bn-BD" }),
    taskCompleted: () => speak("টাস্ক সফলভাবে সম্পন্ন হয়েছে।", { lang: "bn-BD" }),
    error: () => speak("দুঃখিত, একটি সমস্যা হয়েছে।", { lang: "bn-BD" }),
    // Add more specific notifications as needed
  }

  return { speak, stop, voiceNotifications, isSpeaking }
}

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  // This component is primarily for context if needed, but useVoice hook manages its own state.
  return React.createElement(React.Fragment, null, children)
}

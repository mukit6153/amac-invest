"use client"

import { useCallback, useRef } from "react"

export function useVoice() {
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  const initSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
      voicesRef.current = synthRef.current.getVoices()

      // Load voices if not already loaded
      if (voicesRef.current.length === 0) {
        synthRef.current.onvoiceschanged = () => {
          voicesRef.current = synthRef.current!.getVoices()
        }
      }
    }
  }, [])

  const speak = useCallback(
    (text: string, options: { lang?: string; rate?: number; pitch?: number; volume?: number } = {}) => {
      if (!synthRef.current) {
        initSpeech()
      }

      if (synthRef.current) {
        // Cancel any ongoing speech
        synthRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = options.lang || "bn-BD" // Bengali Bangladesh
        utterance.rate = options.rate || 0.8
        utterance.pitch = options.pitch || 1
        utterance.volume = options.volume || 0.7

        // Try to find a Bengali voice
        const bengaliVoice = voicesRef.current.find((voice) => voice.lang.includes("bn"))
        if (bengaliVoice) {
          utterance.voice = bengaliVoice
        }

        synthRef.current.speak(utterance)
      }
    },
    [initSpeech],
  )

  const voiceNotifications = {
    welcome: () => speak("স্বাগতম আমাদের বিনিয়োগ প্ল্যাটফর্মে"),
    balanceUpdate: (amount: number) => speak(`আপনার নতুন ব্যালেন্স ${amount} টাকা`),
    investmentSuccess: (amount: number) => speak(`${amount} টাকার বিনিয়োগ সফল হয়েছে`),
    withdrawalSuccess: (amount: number) => speak(`${amount} টাকা উইথড্র সফল হয়েছে`),
    taskComplete: () => speak("কাজ সম্পন্ন হয়েছে"),
    rewardEarned: (amount: number) => speak(`আপনি ${amount} টাকা পুরস্কার পেয়েছেন`),
    loginBonus: () => speak("লগইন বোনাস পেয়েছেন"),
    spinWin: (amount: number) => speak(`অভিনন্দন! আপনি ${amount} টাকা জিতেছেন`),
    error: () => speak("দুঃখিত, একটি সমস্যা হয়েছে"),
    success: () => speak("সফল হয়েছে"),
  }

  return { speak, voiceNotifications, initSpeech }
}

import { useCallback } from 'react'

type HapticType = 'click' | 'success' | 'error' | 'notification' | 'reward'

export const useHaptic = () => {
  const hapticFeedback = useCallback((type: HapticType = 'click') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      let pattern: number[] = []
      switch (type) {
        case 'click':
          pattern = [50] // Short vibration
          break
        case 'success':
          pattern = [100, 50, 100] // Double pulse
          break
        case 'error':
          pattern = [200, 100, 200] // Longer, distinct pulse
          break
        case 'notification':
          pattern = [70, 30, 70] // Quick double tap
          break
        case 'reward':
          pattern = [50, 20, 50, 20, 50] // Multiple short pulses
          break
        default:
          pattern = [50]
      }
      navigator.vibrate(pattern)
    } else {
      console.warn("Haptic feedback not supported on this device.")
    }
  }, [])

  return { hapticFeedback }
}

export const HapticProvider = ({ children }: { children: React.ReactNode }) => {
  // This component is primarily for context if needed, but useHaptic hook manages its own state.
  return <>{children}</>
}

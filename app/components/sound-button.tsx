'use client'

import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'

export default function SoundButton() {
  const { isSoundEnabled, toggleSound, playSound } = useSound()
  const { vibrate } = useHaptic()

  const handleClick = () => {
    vibrate('light')
    toggleSound()
    if (!isSoundEnabled) { // If sound was just enabled, play a click sound
      playSound('click')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg"
      aria-label={isSoundEnabled ? 'Mute sounds' : 'Unmute sounds'}
    >
      {isSoundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
    </Button>
  )
}

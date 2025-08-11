'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from '@/app/lib/database'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface EnhancedSpinWheelScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

const segments = [
  { text: '$10', value: 10, color: '#FFD700' },
  { text: '$5', value: 5, color: '#FF6347' },
  { text: 'Try Again', value: 0, color: '#8A2BE2' },
  { text: '$20', value: 20, color: '#32CD32' },
  { text: '$2', value: 2, color: '#FF4500' },
  { text: 'No Luck', value: 0, color: '#4682B4' },
  { text: '$15', value: 15, color: '#DAA520' },
  { text: '$1', value: 1, color: '#FFDAB9' },
]

export default function EnhancedSpinWheelScreen({ user, onUserUpdate }: EnhancedSpinWheelScreenProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()
  const { width, height } = useWindowSize()

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    setResult(null)
    setShowConfetti(false)
    playSound('spin')
    vibrate('medium')

    const numSegments = segments.length
    const degreesPerSegment = 360 / numSegments
    const randomSegmentIndex = Math.floor(Math.random() * numSegments)
    const targetSegment = segments[randomSegmentIndex]

    const extraRotations = 5 * 360
    const targetDegree = extraRotations + (360 - (randomSegmentIndex * degreesPerSegment + degreesPerSegment / 2))

    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)'
      wheelRef.current.style.transform = `rotate(${targetDegree}deg)`
    }

    setTimeout(() => {
      setSpinning(false)
      setResult(targetSegment.text)
      if (targetSegment.value > 0) {
        onUserUpdate({ ...user, wallet_balance: user.wallet_balance + targetSegment.value })
        playSound('coin_collect')
        setShowConfetti(true)
        toast({
          title: 'Congratulations!',
          description: `You won ${targetSegment.text}! Your balance has been updated.`,
          variant: 'default',
        })
      } else {
        playSound('error')
        toast({
          title: 'Better Luck Next Time!',
          description: `You landed on ${targetSegment.text}.`,
          variant: 'info',
        })
      }
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none'
        wheelRef.current.style.transform = `rotate(${targetDegree % 360}deg)`
      }
    }, 4000)
  }

  return (
    <div className="p-4 space-y-6 flex flex-col items-center">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={3000}
        />
      )}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Spin the Wheel!</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Spin to win exciting rewards and boost your balance.
      </p>

      <Card className="w-full max-w-md p-6 flex flex-col items-center">
        <div className="relative w-64 h-64 mb-6">
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-4 border-gray-300 dark:border-gray-700 relative overflow-hidden"
            style={{
              background: `conic-gradient(
                ${segments.map((s, i) => `${s.color} ${i * (360 / segments.length)}deg ${((i + 1) * (360 / segments.length))}deg`).join(', ')}
              )`,
            }}
          >
            {segments.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg transform origin-bottom"
                style={{
                  transform: `rotate(${i * (360 / segments.length) + (360 / segments.length / 2)}deg) translateY(-50%)`,
                  clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
                }}
              >
                <span style={{ transform: `rotate(-${i * (360 / segments.length) + (360 / segments.length / 2)}deg)` }}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-red-500" />
        </div>

        <Button onClick={spinWheel} disabled={spinning} className="w-full max-w-xs">
          {spinning ? 'Spinning...' : 'Spin Now'}
        </Button>

        {result && (
          <p className="mt-4 text-lg font-semibold">
            Result: <span className="text-blue-600 dark:text-blue-400">{result}</span>
          </p>
        )}
      </Card>
    </div>
  )
}

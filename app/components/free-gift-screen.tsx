'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GiftIcon } from 'lucide-react'
import { User } from '@/app/lib/database'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface FreeGiftScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

const dummyFreeGifts = [
  { id: 1, name: 'Welcome Gift', description: 'A special gift for new users!', reward_amount: 20, is_claimed: false },
  { id: 2, name: 'Loyalty Bonus', description: 'Thank you for being a loyal user!', reward_amount: 10, is_claimed: false },
  { id: 3, name: 'Referral Milestone', description: 'Bonus for reaching 5 referrals!', reward_amount: 30, is_claimed: true },
]

export default function FreeGiftScreen({ user, onUserUpdate }: FreeGiftScreenProps) {
  const [freeGifts, setFreeGifts] = useState(dummyFreeGifts) // Using dummy data for now
  const [loading, setLoading] = useState(false) // Set to false as using dummy data
  const [showConfetti, setShowConfetti] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()
  const { width, height } = useWindowSize()

  // In a real app, you would fetch gifts from the database and track claimed status per user
  // useEffect(() => {
  //   const fetchFreeGifts = async () => {
  //     setLoading(true);
  //     try {
  //       const fetchedGifts = await dataFunctions.getFreeGifts(user.id); // Assuming a getFreeGifts function exists
  //       setFreeGifts(fetchedGifts);
  //     } catch (error) {
  //       console.error('Error fetching free gifts:', error);
  //       toast({
  //         title: 'Error',
  //         description: 'Failed to load free gifts.',
  //         variant: 'destructive',
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchFreeGifts();
  // }, [user.id]);

  const handleClaimGift = (giftId: number, rewardAmount: number) => {
    vibrate('heavy')
    setLoading(true)
    try {
      // Simulate claiming the gift and updating user balance
      const updatedGifts = freeGifts.map(gift =>
        gift.id === giftId ? { ...gift, is_claimed: true } : gift
      )
      setFreeGifts(updatedGifts)
      onUserUpdate({ ...user, wallet_balance: user.wallet_balance + rewardAmount })
      playSound('bonus')
      setShowConfetti(true)
      toast({
        title: 'Gift Claimed!',
        description: `You received $${rewardAmount} from "${freeGifts.find(g => g.id === giftId)?.name}"!`,
        variant: 'default',
      })
      setTimeout(() => setShowConfetti(false), 3000)
      // In a real app, this would involve a server action to update database
      // await claimFreeGiftAction(user.id, giftId);
    } catch (error: any) {
      console.error('Failed to claim gift:', error)
      playSound('error')
      toast({
        title: 'Claim Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading free gifts...</p>
      </div>
    )
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
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Free Gifts</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Claim your special gifts and boost your wallet balance!
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {freeGifts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No free gifts available at the moment.</p>
        ) : (
          freeGifts.map((gift) => (
            <Card key={gift.id} className="flex flex-col items-center text-center p-4">
              <CardHeader>
                <GiftIcon className="h-12 w-12 text-pink-500 mb-2" />
                <CardTitle className="text-xl font-semibold">{gift.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{gift.description}</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">
                  Reward: ${gift.reward_amount}
                </p>
                <Button
                  onClick={() => handleClaimGift(gift.id, gift.reward_amount)}
                  disabled={gift.is_claimed || loading}
                  className="w-full"
                >
                  {gift.is_claimed ? 'Claimed' : 'Claim Gift'}
                </Button>
                {gift.is_claimed && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">You have already claimed this gift.</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

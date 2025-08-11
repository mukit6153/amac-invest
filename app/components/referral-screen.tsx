'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { User, dataFunctions } from '@/app/lib/database'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'
import { Copy } from 'lucide-react'

interface ReferralScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function ReferralScreen({ user, onUserUpdate }: ReferralScreenProps) {
  const [referrals, setReferrals] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const fetchedReferrals = await dataFunctions.getReferrals(user.id)
        setReferrals(fetchedReferrals)
      } catch (error) {
        console.error('Error fetching referrals:', error)
        toast({
          title: 'Error',
          description: 'Failed to load referrals.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchReferrals()
  }, [user.id])

  const handleCopyReferralCode = () => {
    vibrate('light')
    navigator.clipboard.writeText(user.referral_code)
    playSound('click')
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard.',
      variant: 'default',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading referral data...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Referral System</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Invite your friends and earn rewards!
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="referralCode">Share this code with your friends:</Label>
            <div className="flex items-center space-x-2">
              <Input id="referralCode" type="text" value={user.referral_code} readOnly className="flex-grow" />
              <Button onClick={handleCopyReferralCode} size="icon" aria-label="Copy referral code">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            When your friends sign up using your code, you both get a bonus!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Referrals ({referrals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full">
            {referrals.length === 0 ? (
              <p className="text-center text-gray-500">You haven't referred anyone yet.</p>
            ) : (
              <div className="space-y-2">
                {referrals.map((referredUser) => (
                  <div key={referredUser.id} className="flex items-center justify-between p-2 border rounded-md">
                    <p className="font-medium">{referredUser.email}</p>
                    <span className="text-sm text-gray-500">Joined: {new Date(referredUser.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Referral Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            Earn a bonus of $5 for each friend who signs up and makes their first investment using your code.
          </p>
          <Separator className="my-4" />
          <p className="text-gray-700 dark:text-gray-300">
            You can also earn a percentage of your referrals' daily profits!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

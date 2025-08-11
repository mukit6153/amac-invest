'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSignIcon, BriefcaseIcon, RefreshCwIcon, GiftIcon, UsersIcon, StoreIcon } from 'lucide-react'
import { User } from '@/app/lib/database'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { useVoice } from '@/app/hooks/use-voice'
import { toast } from '@/components/ui/use-toast'

interface HomeScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function HomeScreen({ user, onUserUpdate }: HomeScreenProps) {
  const { playSound } = useSound()
  const { vibrate } = useHaptic()
  const { speak } = useVoice()

  const handleFeatureClick = (featureName: string) => {
    playSound('click')
    vibrate('light')
    speak(`Navigating to ${featureName}`)
    toast({
      title: 'Navigation',
      description: `You clicked on ${featureName}.`,
      variant: 'default',
    })
    // In a real app, this would trigger a state change in the parent
    // to render the corresponding screen. For this demo, it's just a toast.
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Welcome, {user.email}!</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Your current wallet balance: <span className="font-semibold text-green-600 dark:text-green-400">${user.wallet_balance.toFixed(2)}</span>
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <DollarSignIcon className="h-12 w-12 text-blue-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Investment</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Explore various investment packages and grow your money.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Investment')}>
              Invest Now
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <BriefcaseIcon className="h-12 w-12 text-purple-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Complete daily tasks to earn instant rewards.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Daily Tasks')}>
              View Tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <BriefcaseIcon className="h-12 w-12 text-orange-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Intern Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Special tasks for interns to learn and earn more.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Intern Tasks')}>
              Start Intern Tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <RefreshCwIcon className="h-12 w-12 text-green-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Spin Wheel</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Try your luck and win exciting prizes with our spin wheel.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Spin Wheel')}>
              Spin Now
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <GiftIcon className="h-12 w-12 text-red-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Free Gift</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Claim your daily free gifts and boost your balance.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Free Gift')}>
              Claim Gift
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <UsersIcon className="h-12 w-12 text-indigo-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Referral System</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Invite friends and earn bonuses for every successful referral.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Referral System')}>
              Refer Now
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center p-4">
          <CardHeader>
            <StoreIcon className="h-12 w-12 text-yellow-500 mb-2" />
            <CardTitle className="text-xl font-semibold">Product Store</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Redeem your earnings for exciting products from our store.</p>
            <Button className="w-full" onClick={() => handleFeatureClick('Product Store')}>
              Shop Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

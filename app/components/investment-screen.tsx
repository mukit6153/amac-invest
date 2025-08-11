'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { InvestmentPackage, User, dataFunctions } from '@/app/lib/database'
import { investInPackageAction } from '@/app/lib/server-actions' // Import Server Action
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'

interface InvestmentScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function InvestmentScreen({ user, onUserUpdate }: InvestmentScreenProps) {
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [loading, setLoading] = useState(true)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const fetchedPackages = await dataFunctions.getInvestmentPackages()
        setPackages(fetchedPackages)
      } catch (error) {
        console.error('Error fetching investment packages:', error)
        toast({
          title: 'Error',
          description: 'Failed to load investment packages.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const handleInvest = async (packageId: number) => {
    vibrate('medium')
    setLoading(true)
    try {
      const updatedUser = await investInPackageAction(user.id, packageId) // Call Server Action
      onUserUpdate(updatedUser)
      playSound('success')
      toast({
        title: 'Success!',
        description: 'Investment successful!',
        variant: 'default',
      })
    } catch (error: any) {
      console.error('Investment failed:', error)
      playSound('error')
      toast({
        title: 'Investment Failed',
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
        <p>Loading investment packages...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Investment Packages</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Choose an investment package to start earning daily profits.
      </p>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Min Amount:</span> ${pkg.min_amount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Max Amount:</span> ${pkg.max_amount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Daily Profit:</span> {pkg.daily_profit_percentage}%
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {pkg.duration_days} days
                  </p>
                  <p>
                    <span className="font-medium">Total Return:</span> {pkg.total_return_percentage}%
                  </p>
                </div>
                <Separator className="my-4" />
                <Button
                  onClick={() => handleInvest(pkg.id)}
                  disabled={user.wallet_balance < pkg.min_amount || loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Invest Now'}
                </Button>
                {user.wallet_balance < pkg.min_amount && (
                  <p className="text-red-500 text-xs mt-2 text-center">Insufficient balance</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

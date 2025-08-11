'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/app/lib/database'
import { processWithdrawalAction } from '@/app/lib/server-actions' // Import Server Action
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'

interface WithdrawScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function WithdrawScreen({ user, onUserUpdate }: WithdrawScreenProps) {
  const [amount, setAmount] = useState<number | ''>('')
  const [method, setMethod] = useState('')
  const [accountDetails, setAccountDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    vibrate('medium')

    if (amount === '' || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount.',
        variant: 'destructive',
      })
      playSound('error')
      return
    }
    if (amount > user.wallet_balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough balance for this withdrawal.',
        variant: 'destructive',
      })
      playSound('error')
      return
    }
    if (!method) {
      toast({
        title: 'Missing Method',
        description: 'Please select a withdrawal method.',
        variant: 'destructive',
      })
      playSound('error')
      return
    }
    if (!accountDetails) {
      toast({
        title: 'Missing Account Details',
        description: 'Please provide your account details.',
        variant: 'destructive',
      })
      playSound('error')
      return
    }

    setLoading(true)
    try {
      const updatedUser = await processWithdrawalAction(user.id, amount, method, accountDetails) // Call Server Action
      onUserUpdate(updatedUser)
      setAmount('')
      setMethod('')
      setAccountDetails('')
      playSound('success')
      toast({
        title: 'Withdrawal Request Sent!',
        description: 'Your withdrawal request has been submitted successfully.',
        variant: 'default',
      })
    } catch (error: any) {
      console.error('Withdrawal failed:', error)
      playSound('error')
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Withdraw Funds</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Current Balance: <span className="font-semibold">${user.wallet_balance.toFixed(2)}</span>
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">New Withdrawal Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="method">Withdrawal Method</Label>
              <Select value={method} onValueChange={setMethod} required>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bkash">Bkash</SelectItem>
                  <SelectItem value="Nagad">Nagad</SelectItem>
                  <SelectItem value="Rocket">Rocket</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accountDetails">Account Details (e.g., Phone No. or Bank Account)</Label>
              <Textarea
                id="accountDetails"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder="Enter account number, name, etc."
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Withdrawal history will be displayed here. (Feature coming soon!)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

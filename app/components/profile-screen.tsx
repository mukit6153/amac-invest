'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/app/lib/database'
import { updateUserSettingsAction, changePasswordAction } from '@/app/lib/server-actions' // Import Server Actions
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'

interface ProfileScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function ProfileScreen({ user, onUserUpdate }: ProfileScreenProps) {
  const [name, setName] = useState(user.email) // Assuming email is used as name for now
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    vibrate('medium')
    setLoading(true)
    try {
      const updatedUser = await updateUserSettingsAction(user.id, { email: name }) // Update email as name
      onUserUpdate(updatedUser)
      playSound('success')
      toast({
        title: 'Profile Updated!',
        description: 'Your profile information has been saved.',
        variant: 'default',
      })
    } catch (error: any) {
      console.error('Profile update failed:', error)
      playSound('error')
      toast({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    vibrate('medium')

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      })
      playSound('error')
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      })
      playSound('error')
      return
    }

    setLoading(true)
    try {
      const updatedUser = await changePasswordAction(user.id, oldPassword, newPassword) // Call Server Action
      onUserUpdate(updatedUser)
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      playSound('success')
      toast({
        title: 'Password Changed!',
        description: 'Your password has been updated successfully.',
        variant: 'default',
      })
    } catch (error: any) {
      console.error('Password change failed:', error)
      playSound('error')
      toast({
        title: 'Password Change Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} disabled className="bg-gray-100 dark:bg-gray-800" />
          </div>
          <div>
            <Label htmlFor="balance">Wallet Balance</Label>
            <Input id="balance" type="text" value={`$${user.wallet_balance.toFixed(2)}`} disabled className="bg-gray-100 dark:bg-gray-800" />
          </div>
          <div>
            <Label htmlFor="referralCode">Your Referral Code</Label>
            <Input id="referralCode" type="text" value={user.referral_code} disabled className="bg-gray-100 dark:bg-gray-800" />
          </div>
          {user.referred_by && (
            <div>
              <Label htmlFor="referredBy">Referred By</Label>
              <Input id="referredBy" type="text" value={user.referred_by} disabled className="bg-gray-100 dark:bg-gray-800" />
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="name">Name (Email for demo)</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

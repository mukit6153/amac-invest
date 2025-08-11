'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { User } from '@/app/lib/database'
import { updateUserSettingsAction } from '@/app/lib/server-actions' // Import Server Action
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { useVoice } from '@/app/hooks/use-voice'
import { useBackgroundMusic } from '@/app/hooks/use-background-music'
import { toast } from '@/components/ui/use-toast'

interface SettingsScreenProps {
  user: User
  onUserUpdate: (user: User) => void
  isMusicPlaying: boolean
  toggleMusic: () => void
}

export default function SettingsScreen({ user, onUserUpdate, isMusicPlaying, toggleMusic }: SettingsScreenProps) {
  const [loading, setLoading] = useState(false)
  const { playSound, isSoundEnabled, toggleSound } = useSound()
  const { isHapticEnabled, toggleHaptic } = useHaptic()
  const { isVoiceEnabled, toggleVoice } = useVoice()

  const handleToggleSound = async () => {
    vibrate('light')
    toggleSound()
    playSound('click') // Play click sound on toggle
    try {
      await updateUserSettingsAction(user.id, { sound_enabled: !isSoundEnabled })
      toast({
        title: 'Settings Updated',
        description: `Sound ${!isSoundEnabled ? 'enabled' : 'disabled'}.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('Failed to update sound setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to save sound setting.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleHaptic = async () => {
    vibrate('light')
    toggleHaptic()
    try {
      await updateUserSettingsAction(user.id, { haptic_enabled: !isHapticEnabled })
      toast({
        title: 'Settings Updated',
        description: `Haptic feedback ${!isHapticEnabled ? 'enabled' : 'disabled'}.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('Failed to update haptic setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to save haptic setting.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleVoice = async () => {
    vibrate('light')
    toggleVoice()
    try {
      await updateUserSettingsAction(user.id, { voice_enabled: !isVoiceEnabled })
      toast({
        title: 'Settings Updated',
        description: `Voice guidance ${!isVoiceEnabled ? 'enabled' : 'disabled'}.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('Failed to update voice setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to save voice setting.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleMusic = async () => {
    vibrate('light')
    toggleMusic()
    try {
      await updateUserSettingsAction(user.id, { background_music_enabled: !isMusicPlaying })
      toast({
        title: 'Settings Updated',
        description: `Background music ${!isMusicPlaying ? 'enabled' : 'disabled'}.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('Failed to update music setting:', error)
      toast({
        title: 'Error',
        description: 'Failed to save music setting.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">App Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle">Sound Effects</Label>
            <Switch
              id="sound-toggle"
              checked={isSoundEnabled}
              onCheckedChange={handleToggleSound}
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="haptic-toggle">Haptic Feedback</Label>
            <Switch
              id="haptic-toggle"
              checked={isHapticEnabled}
              onCheckedChange={handleToggleHaptic}
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-toggle">Voice Guidance</Label>
            <Switch
              id="voice-toggle"
              checked={isVoiceEnabled}
              onCheckedChange={handleToggleVoice}
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="music-toggle">Background Music</Label>
            <Switch
              id="music-toggle"
              checked={isMusicPlaying}
              onCheckedChange={handleToggleMusic}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Account Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" variant="outline" onClick={() => toast({ title: 'Feature', description: 'Change Password is in Profile Screen.' })}>
            Change Password
          </Button>
          <Button className="w-full" variant="destructive" onClick={() => toast({ title: 'Feature', description: 'Delete Account feature coming soon!' })}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

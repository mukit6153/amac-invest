'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authFunctions, User } from '@/app/lib/database'
import { toast } from '@/components/ui/use-toast'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import Image from 'next/image'

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    vibrate('medium')
    setLoading(true)
    try {
      const user = await authFunctions.signIn(loginEmail, loginPassword)
      if (user) {
        onLoginSuccess(user)
        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${user.email}!`,
          variant: 'default',
        })
      } else {
        playSound('error')
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Login error:', error)
      playSound('error')
      toast({
        title: 'Login Error',
        description: error.message || 'An unexpected error occurred during login.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    vibrate('medium')
    setLoading(true)
    try {
      const user = await authFunctions.signUp(signupName, signupEmail, signupPassword)
      if (user) {
        onLoginSuccess(user)
        toast({
          title: 'Signup Successful!',
          description: `Welcome, ${user.email}! Your account has been created.`,
          variant: 'default',
        })
      } else {
        playSound('error')
        toast({
          title: 'Signup Failed',
          description: 'Could not create account. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      playSound('error')
      toast({
        title: 'Signup Error',
        description: error.message || 'An unexpected error occurred during signup.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 dark:from-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/amac-logo.svg"
            alt="AMAC Investment App Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <CardTitle className="text-2xl">Welcome to AMAC Investment</CardTitle>
          <CardDescription>Login or create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="m@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging In...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signupName">Name</Label>
                  <Input
                    id="signupName"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="m@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

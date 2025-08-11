'use client'

import { useState } from 'react'
import { User } from '@/app/lib/database'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon, HomeIcon, DollarSignIcon, GiftIcon, RefreshCwIcon, UsersIcon, StoreIcon, SettingsIcon, LogOutIcon, BriefcaseIcon, CrownIcon } from 'lucide-react'
import Link from 'next/link'
import HomeScreen from './home-screen'
import InvestmentScreen from './investment-screen'
import TasksScreen from './tasks-screen'
import SpinWheelScreen from './spin-wheel-screen'
import FreeGiftScreen from './free-gift-screen'
import ReferralScreen from './referral-screen'
import ProductStoreScreen from './product-store-screen'
import AdminPanelScreen from './admin-panel-screen'
import ProfileScreen from './profile-screen'
import SettingsScreen from './settings-screen'
import InternTasksScreen from './intern-tasks-screen'
import SoundButton from './sound-button'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { useVoice } from '@/app/hooks/use-voice'
import { useBackgroundMusic } from '@/app/hooks/use-background-music'
import { toast } from '@/components/ui/use-toast'

interface CompleteHomeScreenProps {
  user: User
  onUserUpdate: (user: User) => void
  onLogout: () => void
  isMusicPlaying: boolean
  toggleMusic: () => void
}

export default function CompleteHomeScreen({ user, onUserUpdate, onLogout, isMusicPlaying, toggleMusic }: CompleteHomeScreenProps) {
  const [activeScreen, setActiveScreen] = useState('home')
  const { playSound } = useSound()
  const { vibrate } = useHaptic()
  const { speak } = useVoice()

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen user={user} onUserUpdate={onUserUpdate} />
      case 'investment':
        return <InvestmentScreen user={user} onUserUpdate={onUserUpdate} />
      case 'tasks':
        return <TasksScreen user={user} onUserUpdate={onUserUpdate} />
      case 'intern-tasks':
        return <InternTasksScreen user={user} onUserUpdate={onUserUpdate} />
      case 'spin-wheel':
        return <SpinWheelScreen user={user} onUserUpdate={onUserUpdate} />
      case 'free-gift':
        return <FreeGiftScreen user={user} onUserUpdate={onUserUpdate} />
      case 'referral':
        return <ReferralScreen user={user} onUserUpdate={onUserUpdate} />
      case 'product-store':
        return <ProductStoreScreen user={user} onUserUpdate={onUserUpdate} />
      case 'admin-panel':
        return user.is_admin ? <AdminPanelScreen user={user} /> : <p className="p-4 text-red-500">Access Denied</p>
      case 'profile':
        return <ProfileScreen user={user} onUserUpdate={onUserUpdate} />
      case 'settings':
        return <SettingsScreen user={user} onUserUpdate={onUserUpdate} isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} />
      default:
        return <HomeScreen user={user} onUserUpdate={onUserUpdate} />
    }
  }

  const handleNavigation = (screen: string, speakText: string) => {
    setActiveScreen(screen)
    playSound('click')
    vibrate('light')
    speak(speakText)
  }

  const handleLogoutClick = () => {
    vibrate('medium')
    playSound('click')
    speak('Logging out. Goodbye!')
    onLogout()
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'default',
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open navigation menu"
              onClick={() => { playSound('click'); vibrate('light') }}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <DollarSignIcon className="h-6 w-6" />
                <span>AMAC Investment</span>
              </Link>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('home', 'Home Screen')}>
                <HomeIcon className="h-5 w-5 mr-3" />
                Home
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('investment', 'Investment Packages')}>
                <DollarSignIcon className="h-5 w-5 mr-3" />
                Investment
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('tasks', 'Daily Tasks')}>
                <BriefcaseIcon className="h-5 w-5 mr-3" />
                Daily Tasks
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('intern-tasks', 'Intern Tasks')}>
                <BriefcaseIcon className="h-5 w-5 mr-3" />
                Intern Tasks
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('spin-wheel', 'Spin Wheel')}>
                <RefreshCwIcon className="h-5 w-5 mr-3" />
                Spin Wheel
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('free-gift', 'Free Gift')}>
                <GiftIcon className="h-5 w-5 mr-3" />
                Free Gift
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('referral', 'Referral System')}>
                <UsersIcon className="h-5 w-5 mr-3" />
                Referral
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('product-store', 'Product Store')}>
                <StoreIcon className="h-5 w-5 mr-3" />
                Product Store
              </Button>
              {user.is_admin && (
                <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('admin-panel', 'Admin Panel')}>
                  <CrownIcon className="h-5 w-5 mr-3" />
                  Admin Panel
                </Button>
              )}
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('profile', 'Profile')}>
                <UsersIcon className="h-5 w-5 mr-3" />
                Profile
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation('settings', 'Settings')}>
                <SettingsIcon className="h-5 w-5 mr-3" />
                Settings
              </Button>
              <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogoutClick}>
                <LogOutIcon className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
            <DollarSignIcon className="h-6 w-6" />
            <span className="sr-only">AMAC Investment</span>
          </Link>
          <Button variant="ghost" onClick={() => handleNavigation('home', 'Home Screen')}>Home</Button>
          <Button variant="ghost" onClick={() => handleNavigation('investment', 'Investment Packages')}>Investment</Button>
          <Button variant="ghost" onClick={() => handleNavigation('tasks', 'Daily Tasks')}>Daily Tasks</Button>
          <Button variant="ghost" onClick={() => handleNavigation('intern-tasks', 'Intern Tasks')}>Intern Tasks</Button>
          <Button variant="ghost" onClick={() => handleNavigation('spin-wheel', 'Spin Wheel')}>Spin Wheel</Button>
          <Button variant="ghost" onClick={() => handleNavigation('free-gift', 'Free Gift')}>Free Gift</Button>
          <Button variant="ghost" onClick={() => handleNavigation('referral', 'Referral System')}>Referral</Button>
          <Button variant="ghost" onClick={() => handleNavigation('product-store', 'Product Store')}>Product Store</Button>
          {user.is_admin && (
            <Button variant="ghost" onClick={() => handleNavigation('admin-panel', 'Admin Panel')}>Admin Panel</Button>
          )}
          <Button variant="ghost" onClick={() => handleNavigation('profile', 'Profile')}>Profile</Button>
          <Button variant="ghost" onClick={() => handleNavigation('settings', 'Settings')}>Settings</Button>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <span className="font-medium">Balance: ${user.wallet_balance.toFixed(2)}</span>
          </div>
          <Button variant="ghost" onClick={handleLogoutClick}>
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {renderScreen()}
      </main>
      <SoundButton />
    </div>
  )
}

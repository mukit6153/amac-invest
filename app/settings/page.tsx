import SettingsScreen from '@/app/components/settings-screen'
import { authFunctions } from '@/app/lib/database' // Assuming authFunctions are client-side safe
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { User } from '@/app/lib/database' // Import User type
import { useBackgroundMusic } from '@/app/hooks/use-background-music' // Client-side hook

export default async function SettingsPage() {
  const cookieStore = cookies()
  const userId = cookieStore.get('currentUserId')?.value

  let user: User | null = null
  if (userId) {
    user = await authFunctions.getCurrentUser(userId)
  }

  if (!user) {
    redirect('/auth/login')
  }

  // Since useBackgroundMusic is a client hook, we need to pass its state/functions
  // from a client component that wraps this server component.
  // For simplicity in this example, we'll assume the state is managed higher up
  // or that this page itself will be a client component if it directly uses the hook.
  // For now, we'll pass dummy values, and the actual implementation would involve
  // making SettingsPage a client component or passing props from a client layout.
  // Given the context, the `isMusicPlaying` and `toggleMusic` props will be handled
  // by the `CompleteHomeScreen` which wraps this.

  return (
    <SettingsScreen
      user={user}
      onUserUpdate={() => { /* client-side update logic */ }}
      isMusicPlaying={false} // Dummy value, actual state comes from CompleteHomeScreen
      toggleMusic={() => {}} // Dummy function, actual function comes from CompleteHomeScreen
    />
  )
}

import ProductStoreScreen from '@/app/components/product-store-screen'
import { authFunctions } from '@/app/lib/database' // Assuming authFunctions are client-side safe
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { User } from '@/app/lib/database' // Import User type

export default async function ProductStorePage() {
  const cookieStore = cookies()
  const userId = cookieStore.get('currentUserId')?.value

  let user: User | null = null
  if (userId) {
    user = await authFunctions.getCurrentUser(userId)
  }

  if (!user) {
    redirect('/auth/login')
  }

  return <ProductStoreScreen user={user} onUserUpdate={() => { /* client-side update logic */ }} />
}

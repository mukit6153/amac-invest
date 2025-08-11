'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Product, User, dataFunctions } from '@/app/lib/database'
import { purchaseProductAction } from '@/app/lib/server-actions' // Import Server Action
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface ProductStoreScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function ProductStoreScreen({ user, onUserUpdate }: ProductStoreScreenProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await dataFunctions.getProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast({
          title: 'Error',
          description: 'Failed to load products.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handlePurchase = async (productId: number) => {
    vibrate('medium')
    setLoading(true)
    try {
      const updatedUser = await purchaseProductAction(user.id, productId) // Call Server Action
      onUserUpdate(updatedUser)
      playSound('success')
      toast({
        title: 'Purchase Successful!',
        description: 'Your item has been purchased.',
        variant: 'default',
      })
      // Re-fetch products to update stock display
      const updatedProducts = await dataFunctions.getProducts()
      setProducts(updatedProducts)
    } catch (error: any) {
      console.error('Purchase failed:', error)
      playSound('error')
      toast({
        title: 'Purchase Failed',
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
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Product Store</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Spend your wallet balance on exciting products!
      </p>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="flex flex-col items-center">
                <Image
                  src={product.image_url || '/placeholder.svg?height=100&width=100&query=product'}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover mb-2"
                />
                <CardTitle className="text-xl font-semibold text-center">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>{product.description}</p>
                  <p>
                    <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Stock:</span> {product.stock}
                  </p>
                </div>
                <Separator className="my-4" />
                <Button
                  onClick={() => handlePurchase(product.id)}
                  disabled={user.wallet_balance < product.price || product.stock <= 0 || loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
                </Button>
                {user.wallet_balance < product.price && (
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

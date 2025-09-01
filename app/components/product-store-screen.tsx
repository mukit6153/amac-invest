"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, DollarSign, Package, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { dataFunctions, User, Product, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"
import Image from "next/image"

interface ProductStoreScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function ProductStoreScreen({ user, onUserUpdate }: ProductStoreScreenProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setMessage(null)
      try {
        const fetchedProducts = await dataFunctions.getProducts()
        setProducts(fetchedProducts)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "পণ্য লোড করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()

    if (user?.id) {
      const channel = subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          onUserUpdate(payload.new as User)
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id, onUserUpdate])

  const handlePurchase = async (productId: string) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const updatedUser = await dataFunctions.purchaseProduct(user.id, productId)
      onUserUpdate(updatedUser)
      const updatedProducts = await dataFunctions.getProducts() // Re-fetch products to update stock
      setProducts(updatedProducts)
      setMessage({ type: "success", text: "পণ্য সফলভাবে কেনা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পণ্য কিনতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-3 text-gray-600 bangla-text">লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => { playSound("click"); router.back() }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bangla-text">পণ্য স্টোর</h1>
        <div className="w-5 h-5" /> {/* Placeholder for alignment */}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 overflow-auto">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm bangla-text">{message.text}</span>
          </div>
        )}

        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-lg font-semibold bangla-text">আপনার ব্যালেন্স</span>
            </div>
            <span className="text-3xl font-bold bangla-text">৳{user.balance.toFixed(2)}</span>
          </CardContent>
        </Card>

        {/* Product List */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">পণ্য</h2>
        {products.length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            কোন পণ্য উপলব্ধ নেই।
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg?height=200&width=300&query=product+image"}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-blue-600 bangla-text">{product.name}</h3>
                  <p className="text-sm text-gray-700 bangla-text">{product.description}</p>
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-bold bangla-text">৳{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm bangla-text">স্টক: {product.stock}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 bangla-text"
                    onClick={() => handlePurchase(product.id)}
                    disabled={loading || product.stock <= 0 || user.balance < product.price}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : product.stock <= 0 ? (
                      "স্টকে নেই"
                    ) : user.balance < product.price ? (
                      "অপর্যাপ্ত ব্যালেন্স"
                    ) : (
                      "কিনুন"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

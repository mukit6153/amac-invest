"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import {
  ArrowLeft,
  ShoppingBag,
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Smartphone,
  Shirt,
  Gift,
  Zap,
  Package,
  Truck,
  Shield,
} from "lucide-react"
import type { User } from "../lib/database"

interface ProductStoreScreenProps {
  user: User
  onBack: () => void
}

interface Product {
  id: string
  name: string
  name_bn: string
  description: string
  description_bn: string
  price: number
  original_price: number
  category: string
  image: string
  rating: number
  reviews: number
  in_stock: boolean
  featured: boolean
}

export default function ProductStoreScreen({ user, onBack }: ProductStoreScreenProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<string[]>([])
  const { sounds } = useSound()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    // Mock products data
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Samsung Galaxy A54",
        name_bn: "স্যামসাং গ্যালাক্সি A54",
        description: "Latest Android smartphone with great camera",
        description_bn: "সর্বশেষ অ্যান্ড্রয়েড স্মার্টফোন দুর্দান্ত ক্যামেরা সহ",
        price: 35000,
        original_price: 40000,
        category: "electronics",
        image: "/placeholder.svg?height=200&width=200&text=Samsung+A54",
        rating: 4.5,
        reviews: 128,
        in_stock: true,
        featured: true,
      },
      {
        id: "2",
        name: "Premium T-Shirt",
        name_bn: "প্রিমিয়াম টি-শার্ট",
        description: "Comfortable cotton t-shirt",
        description_bn: "আরামদায়ক কটন টি-শার্ট",
        price: 1200,
        original_price: 1500,
        category: "fashion",
        image: "/placeholder.svg?height=200&width=200&text=T-Shirt",
        rating: 4.2,
        reviews: 45,
        in_stock: true,
        featured: false,
      },
      {
        id: "3",
        name: "Bkash Gift Card",
        name_bn: "বিকাশ গিফট কার্ড",
        description: "Digital gift card for mobile recharge",
        description_bn: "মোবাইল রিচার্জের জন্য ডিজিটাল গিফট কার্ড",
        price: 500,
        original_price: 500,
        category: "gift_cards",
        image: "/placeholder.svg?height=200&width=200&text=Gift+Card",
        rating: 5.0,
        reviews: 89,
        in_stock: true,
        featured: true,
      },
      {
        id: "4",
        name: "Wireless Earbuds",
        name_bn: "ওয়্যারলেস ইয়ারবাড",
        description: "High quality wireless earbuds",
        description_bn: "উচ্চ মানের ওয়্যারলেস ইয়ারবাড",
        price: 2500,
        original_price: 3000,
        category: "electronics",
        image: "/placeholder.svg?height=200&width=200&text=Earbuds",
        rating: 4.3,
        reviews: 67,
        in_stock: true,
        featured: false,
      },
    ]
    setProducts(mockProducts)
  }

  const categories = [
    { id: "all", name: "সব", name_bn: "সব", icon: Package },
    { id: "electronics", name: "Electronics", name_bn: "ইলেকট্রনিক্স", icon: Smartphone },
    { id: "fashion", name: "Fashion", name_bn: "ফ্যাশন", icon: Shirt },
    { id: "gift_cards", name: "Gift Cards", name_bn: "গিফট কার্ড", icon: Gift },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (productId: string) => {
    setCart((prev) => [...prev, productId])
    sounds.success()
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((id) => id !== productId))
    sounds.buttonClick()
  }

  const isInCart = (productId: string) => cart.includes(productId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">পণ্যের দোকান</h1>
                <p className="text-xs text-gray-600">ব্যালেন্স দিয়ে কিনুন</p>
              </div>
            </div>
            <div className="relative">
              <SoundButton variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
              </SoundButton>
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 bg-red-500">{cart.length}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">কেনাকাটার ব্যালেন্স</p>
                <p className="text-2xl font-bold">৳{user.balance.toLocaleString()}</p>
                <p className="text-xs opacity-80">+ ৳{user.bonus_balance.toLocaleString()} বোনাস</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="পণ্য খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <SoundButton
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0 flex items-center gap-1"
              >
                <CategoryIcon className="h-4 w-4" />
                <span className="text-xs">{category.name_bn}</span>
              </SoundButton>
            )
          })}
        </div>

        {/* Featured Products */}
        {selectedCategory === "all" && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold bangla-text flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              ফিচার্ড পণ্য
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {products
                .filter((p) => p.featured)
                .map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name_bn}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500 text-xs">ফিচার্ড</Badge>
                      <SoundButton
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-white hover:bg-white/20 p-1 h-8 w-8"
                      >
                        <Heart className="h-4 w-4" />
                      </SoundButton>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm mb-1">{product.name_bn}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-teal-600">৳{product.price.toLocaleString()}</p>
                          {product.original_price > product.price && (
                            <p className="text-xs text-gray-500 line-through">
                              ৳{product.original_price.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <SoundButton
                          size="sm"
                          onClick={() => (isInCart(product.id) ? removeFromCart(product.id) : addToCart(product.id))}
                          className={`text-xs px-2 ${isInCart(product.id) ? "bg-red-500 hover:bg-red-600" : ""}`}
                        >
                          {isInCart(product.id) ? "বাদ দিন" : "কার্টে"}
                        </SoundButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold bangla-text">
              {selectedCategory === "all" ? "সব পণ্য" : categories.find((c) => c.id === selectedCategory)?.name_bn}
            </h2>
            <SoundButton variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              ফিল্টার
            </SoundButton>
          </div>

          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name_bn}
                        className="w-full h-full object-cover"
                      />
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">স্টক নেই</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-1">{product.name_bn}</h3>
                          <p className="text-xs text-gray-600 mb-2">{product.description_bn}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                            <span className="text-xs text-gray-500">({product.reviews} রিভিউ)</span>
                          </div>
                        </div>
                        <SoundButton variant="ghost" size="sm" className="p-1 h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </SoundButton>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-teal-600">৳{product.price.toLocaleString()}</p>
                          {product.original_price > product.price && (
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500 line-through">
                                ৳{product.original_price.toLocaleString()}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                ছাড়
                              </Badge>
                            </div>
                          )}
                        </div>
                        <SoundButton
                          size="sm"
                          onClick={() => (isInCart(product.id) ? removeFromCart(product.id) : addToCart(product.id))}
                          disabled={!product.in_stock}
                          className={`text-xs px-3 ${isInCart(product.id) ? "bg-red-500 hover:bg-red-600" : ""}`}
                        >
                          {!product.in_stock ? "স্টক নেই" : isInCart(product.id) ? "বাদ দিন" : "কার্টে যোগ করুন"}
                        </SoundButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Store Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              স্টোর তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">ফ্রি ডেলিভারি</p>
                <p className="text-xs text-gray-600">৫০০০ টাকার উপরে অর্ডারে</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">তাৎক্ষণিক ডেলিভারি</p>
                <p className="text-xs text-gray-600">ডিজিটাল পণ্যের জন্য</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">নিরাপদ পেমেন্ট</p>
                <p className="text-xs text-gray-600">ওয়ালেট ব্যালেন্স দিয়ে</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{cart.length} টি পণ্য কার্টে</p>
                <p className="font-bold">
                  মোট: ৳
                  {cart
                    .reduce((total, productId) => {
                      const product = products.find((p) => p.id === productId)
                      return total + (product?.price || 0)
                    }, 0)
                    .toLocaleString()}
                </p>
              </div>
              <SoundButton className="px-6">অর্ডার করুন</SoundButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

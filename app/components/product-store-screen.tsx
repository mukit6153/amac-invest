"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Star,
  Heart,
  Search,
  Filter,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Award,
  Gift,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"

interface ProductStoreScreenProps {
  user: any
  onBack: () => void
}

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    name_bn: "আইফোন ১৫ প্রো",
    description: "Latest iPhone with advanced features",
    description_bn: "সর্বশেষ প্রযুক্তি সহ আইফোন",
    price: 120000,
    originalPrice: 140000,
    category: "smartphone",
    image: "/placeholder.svg?height=200&width=200&text=iPhone",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "MacBook Air M2",
    name_bn: "ম্যাকবুক এয়ার এম২",
    description: "Powerful laptop for professionals",
    description_bn: "পেশাদারদের জন্য শক্তিশালী ল্যাপটপ",
    price: 150000,
    originalPrice: 170000,
    category: "laptop",
    image: "/placeholder.svg?height=200&width=200&text=MacBook",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Apple Watch Series 9",
    name_bn: "অ্যাপল ওয়াচ সিরিজ ৯",
    description: "Advanced smartwatch with health features",
    description_bn: "স্বাস্থ্য বৈশিষ্ট্য সহ স্মার্ট ওয়াচ",
    price: 45000,
    originalPrice: 50000,
    category: "watch",
    image: "/placeholder.svg?height=200&width=200&text=Watch",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    featured: false,
  },
  {
    id: "4",
    name: "AirPods Pro",
    name_bn: "এয়ারপডস প্রো",
    description: "Premium wireless earbuds",
    description_bn: "প্রিমিয়াম ওয়্যারলেস ইয়ারবাড",
    price: 25000,
    originalPrice: 28000,
    category: "headphones",
    image: "/placeholder.svg?height=200&width=200&text=AirPods",
    rating: 4.6,
    reviews: 445,
    inStock: false,
    featured: false,
  },
]

const categories = [
  { id: "all", name: "সব", name_en: "All", icon: Package },
  { id: "smartphone", name: "ফোন", name_en: "Phone", icon: Smartphone },
  { id: "laptop", name: "ল্যাপটপ", name_en: "Laptop", icon: Laptop },
  { id: "watch", name: "ঘড়ি", name_en: "Watch", icon: Watch },
  { id: "headphones", name: "হেডফোন", name_en: "Headphones", icon: Headphones },
]

export default function ProductStoreScreen({ user, onBack }: ProductStoreScreenProps) {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const { sounds } = useSound()

  useEffect(() => {
    filterProducts()
  }, [selectedCategory, searchQuery])

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (productId: string) => {
    setCart((prev) => [...prev, productId])
    sounds.success()
    alert("পণ্য কার্টে যোগ করা হয়েছে!")
  }

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
    sounds.buttonClick()
  }

  const handlePurchase = async (product: any) => {
    if (user.balance < product.price) {
      sounds.error()
      alert("অপর্যাপ্ত ব্যালেন্স")
      return
    }

    setLoading(true)
    try {
      // Simulate purchase
      await new Promise((resolve) => setTimeout(resolve, 2000))
      sounds.success()
      alert(`${product.name_bn} সফলভাবে কেনা হয়েছে!`)
    } catch (error) {
      sounds.error()
      alert("কেনাকাটায় সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.icon || Package
  }

  const featuredProducts = filteredProducts.filter((product) => product.featured)
  const regularProducts = filteredProducts.filter((product) => !product.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SoundButton variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </SoundButton>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">প্রোডাক্ট স্টোর</h1>
                <p className="text-xs text-gray-600">ওয়ালেট ব্যালেন্স দিয়ে কিনুন</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">৳{user.balance.toLocaleString()}</p>
                <p className="text-xs text-gray-500">ব্যালেন্স</p>
              </div>
              <SoundButton variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500">
                    {cart.length}
                  </Badge>
                )}
              </SoundButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="পণ্য খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <SoundButton
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 text-xs"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CategoryIcon className="h-3 w-3 mr-1" />
                {category.name}
              </SoundButton>
            )
          })}
        </div>

        {/* Store Features */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 text-center">
              <Truck className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-green-700">ফ্রি ডেলিভারি</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 text-center">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-blue-700">নিরাপদ পেমেন্ট</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 text-center">
              <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-purple-700">গ্যারান্টি</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                ফিচার্ড প্রোডাক্ট
              </h2>
            </div>
            <div className="grid gap-3">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name_bn}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-sm">{product.name_bn}</h3>
                            <p className="text-xs text-gray-600">{product.description_bn}</p>
                          </div>
                          <SoundButton
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleToggleFavorite(product.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                              }`}
                            />
                          </SoundButton>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({product.reviews} রিভিউ)</span>
                          {!product.inStock && (
                            <Badge variant="destructive" className="text-xs">
                              স্টক নেই
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-green-600">৳{product.price.toLocaleString()}</p>
                            {product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                ৳{product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <SoundButton
                              size="sm"
                              variant="outline"
                              className="text-xs px-2"
                              onClick={() => handleAddToCart(product.id)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </SoundButton>
                            <SoundButton
                              size="sm"
                              className="text-xs px-2"
                              onClick={() => handlePurchase(product)}
                              disabled={!product.inStock || loading || user.balance < product.price}
                            >
                              কিনুন
                            </SoundButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Products */}
        {regularProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                সব প্রোডাক্ট
              </h2>
              <SoundButton variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </SoundButton>
            </div>
            <div className="grid gap-3">
              {regularProducts.map((product) => (
                <Card key={product.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name_bn}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-sm">{product.name_bn}</h3>
                            <p className="text-xs text-gray-600">{product.description_bn}</p>
                          </div>
                          <SoundButton
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleToggleFavorite(product.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                              }`}
                            />
                          </SoundButton>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({product.reviews} রিভিউ)</span>
                          {!product.inStock && (
                            <Badge variant="destructive" className="text-xs">
                              স্টক নেই
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-green-600">৳{product.price.toLocaleString()}</p>
                            {product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                ৳{product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <SoundButton
                              size="sm"
                              variant="outline"
                              className="text-xs px-2"
                              onClick={() => handleAddToCart(product.id)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </SoundButton>
                            <SoundButton
                              size="sm"
                              className="text-xs px-2"
                              onClick={() => handlePurchase(product)}
                              disabled={!product.inStock || loading || user.balance < product.price}
                            >
                              কিনুন
                            </SoundButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">কোন পণ্য পাওয়া যায়নি</p>
              <SoundButton
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                ফিল্টার রিসেট করুন
              </SoundButton>
            </CardContent>
          </Card>
        )}

        {/* Special Offer */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">বিশেষ অফার!</h3>
                <p className="text-sm opacity-90">৫০,০০০ টাকার বেশি কিনলে ১০% ছাড়!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}

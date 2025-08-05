import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Bengali } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-sans-bengali",
})

export const metadata: Metadata = {
  title: "AMAC Investment - বাংলা বিনিয়োগ প্ল্যাটফর্ম",
  description: "নিরাপদ ও লাভজনক বিনিয়োগের জন্য AMAC Investment এ যোগ দিন",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}

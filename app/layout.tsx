import type { Metadata } from "next"
import { Inter, Noto_Sans_Bengali } from 'next/font/google'
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap"
})

export const metadata: Metadata = {
  title: "AMAC Investment - বাংলাদেশের নম্বর ১ বিনিয়োগ প্ল্যাটফর্ম",
  description: "AMAC Investment এ বিনিয়োগ করুন এবং দৈনিক রিটার্ন পান। নিরাপদ ও লাভজনক বিনিয়োগের জন্য আজই যোগ দিন।",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

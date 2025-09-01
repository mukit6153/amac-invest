import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SoundProvider } from "./hooks/use-sound"
import { HapticProvider } from "./hooks/use-haptic"
import { VoiceProvider } from "./hooks/use-voice"
import { BackgroundMusicProvider } from "./hooks/use-background-music"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AMAC Investment App",
  description: "A modern investment platform with daily tasks, spin wheel, and more.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SoundProvider>
            <HapticProvider>
              <VoiceProvider>
                <BackgroundMusicProvider>
                  {children}
                </BackgroundMusicProvider>
              </VoiceProvider>
            </HapticProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

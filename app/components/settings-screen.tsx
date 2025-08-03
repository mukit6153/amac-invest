"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Volume2, Music, Mic, Palette, Moon, Sun, Shield, Bell, Smartphone } from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { useHaptic } from "../hooks/use-haptic"
import { useVoice } from "../hooks/use-voice"
import { useBackgroundMusic } from "../hooks/use-background-music"

interface SettingsScreenProps {
  user: any
}

export default function SettingsScreen({ user }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    sound: {
      enabled: true,
      volume: 70,
      buttonSounds: true,
      rewardSounds: true,
      notificationSounds: true,
      theme: "classic" as "classic" | "modern" | "minimal",
    },
    haptic: {
      enabled: true,
      intensity: 50,
      buttonFeedback: true,
      rewardFeedback: true,
      notificationFeedback: true,
    },
    voice: {
      enabled: false,
      language: "bn-BD",
      rate: 80,
      pitch: 100,
      volume: 70,
      announcements: true,
      balanceUpdates: true,
      rewards: true,
    },
    music: {
      enabled: false,
      volume: 30,
      theme: "peaceful" as "peaceful" | "energetic" | "focus",
      autoPlay: false,
    },
    appearance: {
      theme: "light" as "light" | "dark" | "auto",
      language: "bn" as "bn" | "en",
      animations: true,
      reducedMotion: false,
    },
    notifications: {
      push: true,
      email: false,
      sms: false,
      investment: true,
      tasks: true,
      events: true,
      rewards: true,
    },
    privacy: {
      analytics: true,
      crashReports: true,
      personalizedAds: false,
      dataSharing: false,
    },
  })

  const { sounds } = useSound()
  const { hapticFeedback } = useHaptic()
  const { voiceNotifications, initSpeech } = useVoice()
  const { musicTracks, stopMusic, setVolume, isPlaying, currentTrack } = useBackgroundMusic()

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("app-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSettings = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value,
      },
    }
    setSettings(newSettings)
    localStorage.setItem("app-settings", JSON.stringify(newSettings))

    // Apply settings immediately
    if (category === "music" && key === "volume") {
      setVolume(value / 100)
    }
  }

  const testSound = (type: string) => {
    switch (type) {
      case "button":
        sounds.buttonClick()
        if (settings.haptic.enabled) hapticFeedback.click()
        break
      case "success":
        sounds.success()
        if (settings.haptic.enabled) hapticFeedback.success()
        break
      case "reward":
        sounds.rewardBig()
        if (settings.haptic.enabled) hapticFeedback.reward()
        break
      case "notification":
        sounds.notification()
        if (settings.haptic.enabled) hapticFeedback.notification()
        break
    }
  }

  const testVoice = () => {
    initSpeech()
    voiceNotifications.welcome()
  }

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic()
    } else {
      musicTracks[settings.music.theme as keyof typeof musicTracks]()
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold bangla-text mb-2">সেটিংস</h1>
        <p className="text-gray-600 bangla-text">আপনার পছন্দ অনুযায়ী অ্যাপ কাস্টমাইজ করুন</p>
      </div>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Volume2 className="h-5 w-5 text-blue-600" />
            সাউন্ড সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Sound Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">সাউন্ড চালু/বন্ধ</p>
              <p className="text-sm text-gray-600 bangla-text">সব সাউন্ড ইফেক্ট নিয়ন্ত্রণ করুন</p>
            </div>
            <Switch
              checked={settings.sound.enabled}
              onCheckedChange={(checked) => updateSettings("sound", "enabled", checked)}
            />
          </div>

          {settings.sound.enabled && (
            <>
              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium bangla-text">ভলিউম</p>
                  <span className="text-sm text-gray-600">{settings.sound.volume}%</span>
                </div>
                <Slider
                  value={[settings.sound.volume]}
                  onValueChange={([value]) => updateSettings("sound", "volume", value)}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Sound Types */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">বাটন সাউন্ড</p>
                    <p className="text-sm text-gray-600 bangla-text">ক্লিক এবং হোভার সাউন্ড</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      size="sm"
                      variant="outline"
                      onClick={() => testSound("button")}
                      className="bangla-text"
                    >
                      টেস্ট
                    </SoundButton>
                    <Switch
                      checked={settings.sound.buttonSounds}
                      onCheckedChange={(checked) => updateSettings("sound", "buttonSounds", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">রিওয়ার্ড সাউন্ড</p>
                    <p className="text-sm text-gray-600 bangla-text">পুরস্কার এবং বোনাস সাউন্ড</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      size="sm"
                      variant="outline"
                      onClick={() => testSound("reward")}
                      className="bangla-text"
                    >
                      টেস্ট
                    </SoundButton>
                    <Switch
                      checked={settings.sound.rewardSounds}
                      onCheckedChange={(checked) => updateSettings("sound", "rewardSounds", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">নোটিফিকেশন সাউন্ড</p>
                    <p className="text-sm text-gray-600 bangla-text">অ্যালার্ট এবং বার্তা সাউন্ড</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      size="sm"
                      variant="outline"
                      onClick={() => testSound("notification")}
                      className="bangla-text"
                    >
                      টেস্ট
                    </SoundButton>
                    <Switch
                      checked={settings.sound.notificationSounds}
                      onCheckedChange={(checked) => updateSettings("sound", "notificationSounds", checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Sound Theme */}
              <div className="space-y-3">
                <p className="font-medium bangla-text">সাউন্ড থিম</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "classic", label: "ক্লাসিক", icon: "🎵" },
                    { id: "modern", label: "মডার্ন", icon: "🎶" },
                    { id: "minimal", label: "মিনিমাল", icon: "🔇" },
                  ].map((theme) => (
                    <SoundButton
                      key={theme.id}
                      variant={settings.sound.theme === theme.id ? "default" : "outline"}
                      onClick={() => updateSettings("sound", "theme", theme.id)}
                      className="flex-col gap-1 h-16 bangla-text"
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className="text-xs">{theme.label}</span>
                    </SoundButton>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Haptic Feedback Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Smartphone className="h-5 w-5 text-purple-600" />
            হ্যাপটিক ফিডব্যাক
            <Badge variant="secondary" className="text-xs">
              মোবাইল
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">ভাইব্রেশন চালু/বন্ধ</p>
              <p className="text-sm text-gray-600 bangla-text">স্পর্শ ফিডব্যাক নিয়ন্ত্রণ করুন</p>
            </div>
            <Switch
              checked={settings.haptic.enabled}
              onCheckedChange={(checked) => updateSettings("haptic", "enabled", checked)}
            />
          </div>

          {settings.haptic.enabled && (
            <>
              {/* Haptic Intensity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium bangla-text">ভাইব্রেশন শক্তি</p>
                  <span className="text-sm text-gray-600">{settings.haptic.intensity}%</span>
                </div>
                <Slider
                  value={[settings.haptic.intensity]}
                  onValueChange={([value]) => updateSettings("haptic", "intensity", value)}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Haptic Types */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">বাটন ফিডব্যাক</p>
                    <p className="text-sm text-gray-600 bangla-text">ক্লিক করার সময় ভাইব্রেশন</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      size="sm"
                      variant="outline"
                      onClick={() => hapticFeedback.click()}
                      className="bangla-text"
                    >
                      টেস্ট
                    </SoundButton>
                    <Switch
                      checked={settings.haptic.buttonFeedback}
                      onCheckedChange={(checked) => updateSettings("haptic", "buttonFeedback", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">রিওয়ার্ড ফিডব্যাক</p>
                    <p className="text-sm text-gray-600 bangla-text">পুরস্কার পাওয়ার সময় ভাইব্রেশন</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      size="sm"
                      variant="outline"
                      onClick={() => hapticFeedback.reward()}
                      className="bangla-text"
                    >
                      টেস্ট
                    </SoundButton>
                    <Switch
                      checked={settings.haptic.rewardFeedback}
                      onCheckedChange={(checked) => updateSettings("haptic", "rewardFeedback", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">নোটিফিকেশন ফিডব্যাক</p>
                    <p className="text-sm text-gray-600 bangla-text">বার্তা আসার সময় ভাইব্রেশন</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      size="sm"
                      variant="outline"
                      onClick={() => hapticFeedback.notification()}
                      className="bangla-text"
                    >
                      টেস্ট
                    </SoundButton>
                    <Switch
                      checked={settings.haptic.notificationFeedback}
                      onCheckedChange={(checked) => updateSettings("haptic", "notificationFeedback", checked)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Mic className="h-5 w-5 text-green-600" />
            ভয়েস নোটিফিকেশন
            <Badge variant="secondary" className="text-xs">
              বাংলা
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">ভয়েস চালু/বন্ধ</p>
              <p className="text-sm text-gray-600 bangla-text">বাংলা ভয়েস নোটিফিকেশন</p>
            </div>
            <Switch
              checked={settings.voice.enabled}
              onCheckedChange={(checked) => updateSettings("voice", "enabled", checked)}
            />
          </div>

          {settings.voice.enabled && (
            <>
              {/* Voice Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium bangla-text">ভয়েস ভলিউম</p>
                  <span className="text-sm text-gray-600">{settings.voice.volume}%</span>
                </div>
                <Slider
                  value={[settings.voice.volume]}
                  onValueChange={([value]) => updateSettings("voice", "volume", value)}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Speech Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium bangla-text">কথা বলার গতি</p>
                  <span className="text-sm text-gray-600">{settings.voice.rate}%</span>
                </div>
                <Slider
                  value={[settings.voice.rate]}
                  onValueChange={([value]) => updateSettings("voice", "rate", value)}
                  min={50}
                  max={150}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Voice Test */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium bangla-text">ভয়েস টেস্ট</p>
                  <p className="text-sm text-gray-600 bangla-text">বাংলা ভয়েস শুনুন</p>
                </div>
                <SoundButton size="sm" variant="outline" onClick={testVoice} className="bangla-text">
                  টেস্ট করুন
                </SoundButton>
              </div>

              {/* Voice Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">ব্যালেন্স আপডেট</p>
                    <p className="text-sm text-gray-600 bangla-text">ব্যালেন্স পরিবর্তনের ঘোষণা</p>
                  </div>
                  <Switch
                    checked={settings.voice.balanceUpdates}
                    onCheckedChange={(checked) => updateSettings("voice", "balanceUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">পুরস্কার ঘোষণা</p>
                    <p className="text-sm text-gray-600 bangla-text">পুরস্কার পাওয়ার ঘোষণা</p>
                  </div>
                  <Switch
                    checked={settings.voice.rewards}
                    onCheckedChange={(checked) => updateSettings("voice", "rewards", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium bangla-text">সাধারণ ঘোষণা</p>
                    <p className="text-sm text-gray-600 bangla-text">গুরুত্বপূর্ণ বার্তার ঘোষণা</p>
                  </div>
                  <Switch
                    checked={settings.voice.announcements}
                    onCheckedChange={(checked) => updateSettings("voice", "announcements", checked)}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Background Music Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Music className="h-5 w-5 text-indigo-600" />
            ব্যাকগ্রাউন্ড মিউজিক
            {isPlaying && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                চলছে
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">মিউজিক চালু/বন্ধ</p>
              <p className="text-sm text-gray-600 bangla-text">শান্ত পরিবেশের জন্য মিউজিক</p>
            </div>
            <Switch
              checked={settings.music.enabled}
              onCheckedChange={(checked) => updateSettings("music", "enabled", checked)}
            />
          </div>

          {settings.music.enabled && (
            <>
              {/* Music Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium bangla-text">মিউজিক ভলিউম</p>
                  <span className="text-sm text-gray-600">{settings.music.volume}%</span>
                </div>
                <Slider
                  value={[settings.music.volume]}
                  onValueChange={([value]) => updateSettings("music", "volume", value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Music Theme */}
              <div className="space-y-3">
                <p className="font-medium bangla-text">মিউজিক থিম</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "peaceful", label: "শান্ত", icon: "🎼", desc: "মেডিটেশনের জন্য" },
                    { id: "energetic", label: "উৎসাহী", icon: "🎵", desc: "কাজের জন্য" },
                    { id: "focus", label: "মনোযোগ", icon: "🎶", desc: "ফোকাসের জন্য" },
                  ].map((theme) => (
                    <SoundButton
                      key={theme.id}
                      variant={settings.music.theme === theme.id ? "default" : "outline"}
                      onClick={() => updateSettings("music", "theme", theme.id)}
                      className="flex-col gap-1 h-20 bangla-text"
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className="text-xs font-medium">{theme.label}</span>
                      <span className="text-xs text-gray-500">{theme.desc}</span>
                    </SoundButton>
                  ))}
                </div>
              </div>

              {/* Music Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium bangla-text">মিউজিক কন্ট্রোল</p>
                  <p className="text-sm text-gray-600 bangla-text">
                    {isPlaying ? `${currentTrack} চলছে` : "মিউজিক বন্ধ"}
                  </p>
                </div>
                <SoundButton
                  size="sm"
                  variant={isPlaying ? "destructive" : "default"}
                  onClick={toggleMusic}
                  className="bangla-text"
                >
                  {isPlaying ? "বন্ধ করুন" : "চালু করুন"}
                </SoundButton>
              </div>

              {/* Auto Play */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium bangla-text">অটো প্লে</p>
                  <p className="text-sm text-gray-600 bangla-text">অ্যাপ খোলার সাথে সাথে মিউজিক চালু</p>
                </div>
                <Switch
                  checked={settings.music.autoPlay}
                  onCheckedChange={(checked) => updateSettings("music", "autoPlay", checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Palette className="h-5 w-5 text-pink-600" />
            চেহারা ও ভাষা
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <p className="font-medium bangla-text">থিম</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", label: "হালকা", icon: <Sun className="h-4 w-4" /> },
                { id: "dark", label: "গাঢ়", icon: <Moon className="h-4 w-4" /> },
                { id: "auto", label: "অটো", icon: <Smartphone className="h-4 w-4" /> },
              ].map((theme) => (
                <SoundButton
                  key={theme.id}
                  variant={settings.appearance.theme === theme.id ? "default" : "outline"}
                  onClick={() => updateSettings("appearance", "theme", theme.id)}
                  className="flex-col gap-1 h-16 bangla-text"
                >
                  {theme.icon}
                  <span className="text-xs">{theme.label}</span>
                </SoundButton>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <p className="font-medium bangla-text">ভাষা</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "bn", label: "বাংলা", flag: "🇧🇩" },
                { id: "en", label: "English", flag: "🇺🇸" },
              ].map((lang) => (
                <SoundButton
                  key={lang.id}
                  variant={settings.appearance.language === lang.id ? "default" : "outline"}
                  onClick={() => updateSettings("appearance", "language", lang.id)}
                  className="flex items-center gap-2 h-12"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </SoundButton>
              ))}
            </div>
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">অ্যানিমেশন</p>
              <p className="text-sm text-gray-600 bangla-text">মসৃণ ট্রানজিশন এবং ইফেক্ট</p>
            </div>
            <Switch
              checked={settings.appearance.animations}
              onCheckedChange={(checked) => updateSettings("appearance", "animations", checked)}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">কম গতি</p>
              <p className="text-sm text-gray-600 bangla-text">অ্যানিমেশন কমিয়ে দিন</p>
            </div>
            <Switch
              checked={settings.appearance.reducedMotion}
              onCheckedChange={(checked) => updateSettings("appearance", "reducedMotion", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Bell className="h-5 w-5 text-yellow-600" />
            নোটিফিকেশন
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">পুশ নোটিফিকেশন</p>
              <p className="text-sm text-gray-600 bangla-text">তাৎক্ষণিক বার্তা পান</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => updateSettings("notifications", "push", checked)}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">ইমেইল নোটিফিকেশন</p>
              <p className="text-sm text-gray-600 bangla-text">ইমেইলে বার্তা পান</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">এসএমএস নোটিফিকেশন</p>
              <p className="text-sm text-gray-600 bangla-text">ফোনে বার্তা পান</p>
            </div>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => updateSettings("notifications", "sms", checked)}
            />
          </div>

          {/* Notification Types */}
          <div className="space-y-4 pt-4 border-t">
            <p className="font-medium bangla-text">নোটিফিকেশনের ধরন</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium bangla-text">বিনিয়োগ আপডেট</p>
                <p className="text-sm text-gray-600 bangla-text">বিনিয়োগ সংক্রান্ত বার্তা</p>
              </div>
              <Switch
                checked={settings.notifications.investment}
                onCheckedChange={(checked) => updateSettings("notifications", "investment", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium bangla-text">টাস্ক রিমাইন্ডার</p>
                <p className="text-sm text-gray-600 bangla-text">কাজের অনুস্মারক</p>
              </div>
              <Switch
                checked={settings.notifications.tasks}
                onCheckedChange={(checked) => updateSettings("notifications", "tasks", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium bangla-text">ইভেন্ট আপডেট</p>
                <p className="text-sm text-gray-600 bangla-text">নতুন ইভেন্টের খবর</p>
              </div>
              <Switch
                checked={settings.notifications.events}
                onCheckedChange={(checked) => updateSettings("notifications", "events", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium bangla-text">পুরস্কার আপডেট</p>
                <p className="text-sm text-gray-600 bangla-text">পুরস্কার এবং বোনাসের খবর</p>
              </div>
              <Switch
                checked={settings.notifications.rewards}
                onCheckedChange={(checked) => updateSettings("notifications", "rewards", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Shield className="h-5 w-5 text-red-600" />
            গোপনীয়তা ও নিরাপত্তা
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">অ্যানালিটিক্স</p>
              <p className="text-sm text-gray-600 bangla-text">অ্যাপ উন্নতির জন্য ডেটা শেয়ার করুন</p>
            </div>
            <Switch
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) => updateSettings("privacy", "analytics", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">ক্র্যাশ রিপোর্ট</p>
              <p className="text-sm text-gray-600 bangla-text">সমস্যা সমাধানের জন্য রিপোর্ট পাঠান</p>
            </div>
            <Switch
              checked={settings.privacy.crashReports}
              onCheckedChange={(checked) => updateSettings("privacy", "crashReports", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">ব্যক্তিগত বিজ্ঞাপন</p>
              <p className="text-sm text-gray-600 bangla-text">আপনার পছন্দ অনুযায়ী বিজ্ঞাপন</p>
            </div>
            <Switch
              checked={settings.privacy.personalizedAds}
              onCheckedChange={(checked) => updateSettings("privacy", "personalizedAds", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">ডেটা শেয়ারিং</p>
              <p className="text-sm text-gray-600 bangla-text">তৃতীয় পক্ষের সাথে ডেটা শেয়ার</p>
            </div>
            <Switch
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) => updateSettings("privacy", "dataSharing", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Settings */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 bangla-text">সেটিংস রিসেট</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium bangla-text">সব সেটিংস রিসেট করুন</p>
              <p className="text-sm text-gray-600 bangla-text">সব সেটিংস ডিফল্ট অবস্থায় ফিরিয়ে আনুন</p>
            </div>
            <SoundButton
              variant="destructive"
              onClick={() => {
                localStorage.removeItem("app-settings")
                window.location.reload()
              }}
              className="bangla-text"
            >
              রিসেট করুন
            </SoundButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Event, User } from '@/app/lib/database'
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'

interface EnhancedEventsScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

const dummyEvents: Event[] = [
  {
    id: 1,
    title: 'Daily Login Streak Bonus',
    description: 'Log in daily for 7 consecutive days to earn an extra bonus!',
    start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    reward_amount: 50,
    status: 'active',
  },
  {
    id: 2,
    title: 'Weekend Investment Boost',
    description: 'Invest any amount this weekend and get an additional 1% daily profit for 3 days.',
    start_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    reward_amount: 0,
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Referral Frenzy',
    description: 'Refer 3 new active users and get a $25 bonus per referral!',
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reward_amount: 75,
    status: 'completed',
  },
  {
    id: 4,
    title: 'New User Welcome Gift',
    description: 'New users get a special welcome gift upon their first investment.',
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    reward_amount: 10,
    status: 'active',
  },
]

export default function EnhancedEventsScreen({ user, onUserUpdate }: EnhancedEventsScreenProps) {
  const [events, setEvents] = useState<Event[]>(dummyEvents)
  const [loading, setLoading] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  const handleParticipate = (eventId: number) => {
    vibrate('medium')
    playSound('click')
    toast({
      title: 'Participation Confirmed!',
      description: `You are now participating in Event ID: ${eventId}. Check event details for requirements.`,
      variant: 'default',
    })
  }

  const filterEvents = (status: 'active' | 'upcoming' | 'completed') => {
    return events.filter(event => event.status === status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading events...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Events & Promotions</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Participate in our exciting events to earn extra rewards!
      </p>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="grid gap-4">
                  {filterEvents('active').length === 0 ? (
                    <p className="text-center text-gray-500">No active events currently.</p>
                  ) : (
                    filterEvents('active').map((event) => (
                      <Card key={event.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between space-y-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
                          <p className="text-xs text-gray-500">Ends: {new Date(event.end_date).toLocaleDateString()}</p>
                          {event.reward_amount > 0 && (
                            <span className="text-md font-medium text-green-600 dark:text-green-400">
                              Reward: ${event.reward_amount}
                            </span>
                          )}
                          <Button
                            onClick={() => handleParticipate(event.id)}
                            className="w-full mt-2"
                          >
                            Participate Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="grid gap-4">
                  {filterEvents('upcoming').length === 0 ? (
                    <p className="text-center text-gray-500">No upcoming events planned.</p>
                  ) : (
                    filterEvents('upcoming').map((event) => (
                      <Card key={event.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between space-y-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
                          <p className="text-xs text-gray-500">Starts: {new Date(event.start_date).toLocaleDateString()}</p>
                          {event.reward_amount > 0 && (
                            <span className="text-md font-medium text-green-600 dark:text-green-400">
                              Potential Reward: ${event.reward_amount}
                            </span>
                          )}
                          <Button disabled className="w-full mt-2">
                            Coming Soon
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="grid gap-4">
                  {filterEvents('completed').length === 0 ? (
                    <p className="text-center text-gray-500">No completed events yet.</p>
                  ) : (
                    filterEvents('completed').map((event) => (
                      <Card key={event.id} className="flex flex-col opacity-70">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between space-y-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
                          <p className="text-xs text-gray-500">Ended: {new Date(event.end_date).toLocaleDateString()}</p>
                          {event.reward_amount > 0 && (
                            <span className="text-md font-medium text-green-600 dark:text-green-400">
                              Reward: ${event.reward_amount}
                            </span>
                          )}
                          <Button disabled className="w-full mt-2">
                            Event Ended
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

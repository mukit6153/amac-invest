'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { InternTask, User, dataFunctions } from '@/app/lib/database'
import { completeInternTaskAction } from '@/app/lib/server-actions' // Import Server Action
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface InternTasksScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function InternTasksScreen({ user, onUserUpdate }: InternTasksScreenProps) {
  const [internTasks, setInternTasks] = useState<InternTask[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()
  const { width, height } = useWindowSize()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await dataFunctions.getInternTasks(user.id)
        setInternTasks(fetchedTasks)
      } catch (error) {
        console.error('Error fetching intern tasks:', error)
        toast({
          title: 'Error',
          description: 'Failed to load intern tasks.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [user.id, user.completed_intern_tasks])

  const handleCompleteTask = async (taskId: number) => {
    vibrate('medium')
    setLoading(true)
    try {
      const updatedUser = await completeInternTaskAction(user.id, taskId) // Call Server Action
      onUserUpdate(updatedUser)
      playSound('coin_collect')
      setShowConfetti(true)
      toast({
        title: 'Task Completed!',
        description: `You earned ${internTasks.find(t => t.id === taskId)?.reward_amount || 0} for completing this task.`,
        variant: 'default',
      })
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error: any) {
      console.error('Failed to complete task:', error)
      playSound('error')
      toast({
        title: 'Task Failed',
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
        <p>Loading intern tasks...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={3000}
        />
      )}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Intern Tasks</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Complete these tasks to gain experience and earn rewards.
      </p>

      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="grid gap-4">
          {internTasks.length === 0 ? (
            <p className="text-center text-gray-500">No intern tasks available.</p>
          ) : (
            internTasks.map((task) => (
              <Card key={task.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                  {task.video_url && (
                    <div className="aspect-video w-full rounded-md overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={task.video_url}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-md font-medium text-green-600 dark:text-green-400">
                      Reward: ${task.reward_amount}
                    </span>
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={task.is_completed || loading}
                      className="px-4 py-2"
                    >
                      {task.is_completed ? 'Completed' : 'Complete Task'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

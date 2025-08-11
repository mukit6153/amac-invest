'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { DailyTask, User, dataFunctions } from '@/app/lib/database'
import { completeDailyTaskAction, claimDailyBonusAction } from '@/app/lib/server-actions' // Import Server Actions
import { useSound } from '@/app/hooks/use-sound'
import { useHaptic } from '@/app/hooks/use-haptic'
import { toast } from '@/components/ui/use-toast'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface TasksScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function TasksScreen({ user, onUserUpdate }: TasksScreenProps) {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()
  const { width, height } = useWindowSize()

  const today = new Date().toDateString()
  const lastClaimDate = user.last_daily_bonus_claim ? new Date(user.last_daily_bonus_claim).toDateString() : null
  const hasClaimedDailyBonusToday = lastClaimDate === today

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await dataFunctions.getDailyTasks(user.id)
        setDailyTasks(fetchedTasks)
      } catch (error) {
        console.error('Error fetching daily tasks:', error)
        toast({
          title: 'Error',
          description: 'Failed to load daily tasks.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [user.id, user.completed_daily_tasks]) // Re-fetch if user's completed tasks change

  const handleCompleteTask = async (taskId: number) => {
    vibrate('medium')
    setLoading(true)
    try {
      const updatedUser = await completeDailyTaskAction(user.id, taskId) // Call Server Action
      onUserUpdate(updatedUser)
      playSound('coin_collect')
      setShowConfetti(true)
      toast({
        title: 'Task Completed!',
        description: `You earned ${dailyTasks.find(t => t.id === taskId)?.reward_amount || 0} for completing this task.`,
        variant: 'default',
      })
      setTimeout(() => setShowConfetti(false), 3000) // Hide confetti after 3 seconds
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

  const handleClaimDailyBonus = async () => {
    vibrate('heavy')
    setLoading(true)
    try {
      const updatedUser = await claimDailyBonusAction(user.id) // Call Server Action
      onUserUpdate(updatedUser)
      playSound('bonus')
      setShowConfetti(true)
      toast({
        title: 'Daily Bonus Claimed!',
        description: `You received ${user.daily_bonus_amount} as your daily bonus!`,
        variant: 'default',
      })
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error: any) {
      console.error('Failed to claim daily bonus:', error)
      playSound('error')
      toast({
        title: 'Bonus Claim Failed',
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
        <p>Loading tasks...</p>
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
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Daily Tasks & Bonuses</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Complete tasks and claim your daily bonus to earn rewards.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Daily Login Bonus</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <p className="text-lg font-medium">Claim your daily reward of ${user.daily_bonus_amount}!</p>
          <Button
            onClick={handleClaimDailyBonus}
            disabled={hasClaimedDailyBonusToday || loading}
            className="w-full max-w-xs"
          >
            {hasClaimedDailyBonusToday ? 'Claimed Today' : 'Claim Bonus'}
          </Button>
          {hasClaimedDailyBonusToday && (
            <p className="text-sm text-green-600 dark:text-green-400">You have already claimed your bonus for today.</p>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Daily Tasks</h2>
      <ScrollArea className="h-[calc(100vh-450px)]">
        <div className="grid gap-4">
          {dailyTasks.length === 0 ? (
            <p className="text-center text-gray-500">No daily tasks available today.</p>
          ) : (
            dailyTasks.map((task) => (
              <Card key={task.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                  <div className="flex items-center justify-between">
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

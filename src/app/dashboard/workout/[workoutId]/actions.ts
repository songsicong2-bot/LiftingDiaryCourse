'use server'

import { z } from 'zod'
import { updateWorkout } from '@/data/workouts'

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().optional(),
  date: z.string().date(),
})

export async function updateWorkoutAction(params: {
  workoutId: number
  name?: string
  date: string
}) {
  const parsed = updateWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await updateWorkout(parsed.data)
}

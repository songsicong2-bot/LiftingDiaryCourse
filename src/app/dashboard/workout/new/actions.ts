'use server'

import { z } from 'zod'
import { createWorkout } from '@/data/workouts'
import { redirect } from 'next/navigation'

const createWorkoutSchema = z.object({
  name: z.string().optional(),
  date: z.string().date(),
})

export async function createWorkoutAction(params: {
  name?: string
  date: string
}) {
  const parsed = createWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await createWorkout(parsed.data)
  redirect('/dashboard')
}

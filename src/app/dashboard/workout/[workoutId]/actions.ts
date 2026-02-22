'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { updateWorkout } from '@/data/workouts'
import {
  addExerciseToWorkout,
  addSet,
  createExercise,
  deleteSet,
  removeExerciseFromWorkout,
  updateSet,
} from '@/data/exercises'

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

const addExerciseToWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  exerciseId: z.number().int().positive(),
})

export async function addExerciseToWorkoutAction(params: {
  workoutId: number
  exerciseId: number
}) {
  const parsed = addExerciseToWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await addExerciseToWorkout(parsed.data)
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`)
}

const createAndAddExerciseSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(255),
})

export async function createAndAddExerciseAction(params: {
  workoutId: number
  name: string
}) {
  const parsed = createAndAddExerciseSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  const exercise = await createExercise({ name: parsed.data.name })
  await addExerciseToWorkout({
    workoutId: parsed.data.workoutId,
    exerciseId: exercise.id,
  })
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`)
}

const removeExerciseFromWorkoutSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
  workoutId: z.number().int().positive(),
})

export async function removeExerciseFromWorkoutAction(params: {
  workoutExerciseId: number
  workoutId: number
}) {
  const parsed = removeExerciseFromWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await removeExerciseFromWorkout({
    workoutExerciseId: parsed.data.workoutExerciseId,
  })
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`)
}

const addSetSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
  workoutId: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weight: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
})

export async function addSetAction(params: {
  workoutExerciseId: number
  workoutId: number
  reps?: number
  weight?: string
}) {
  const parsed = addSetSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await addSet({
    workoutExerciseId: parsed.data.workoutExerciseId,
    reps: parsed.data.reps,
    weight: parsed.data.weight,
  })
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`)
}

const updateSetSchema = z.object({
  setId: z.number().int().positive(),
  workoutId: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weight: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  completed: z.boolean().optional(),
})

export async function updateSetAction(params: {
  setId: number
  workoutId: number
  reps?: number
  weight?: string
  completed?: boolean
}) {
  const parsed = updateSetSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await updateSet({
    setId: parsed.data.setId,
    reps: parsed.data.reps,
    weight: parsed.data.weight,
    completed: parsed.data.completed,
  })
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`)
}

const deleteSetSchema = z.object({
  setId: z.number().int().positive(),
  workoutId: z.number().int().positive(),
})

export async function deleteSetAction(params: {
  setId: number
  workoutId: number
}) {
  const parsed = deleteSetSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await deleteSet({ setId: parsed.data.setId })
  revalidatePath(`/dashboard/workout/${parsed.data.workoutId}`)
}

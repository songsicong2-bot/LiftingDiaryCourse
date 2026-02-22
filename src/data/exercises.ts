import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { exercises, workouts, workoutExercises, sets } from '@/db/schema'
import { and, eq, max } from 'drizzle-orm'

export async function getAllExercises() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  return db
    .select({ id: exercises.id, name: exercises.name })
    .from(exercises)
    .orderBy(exercises.name)
}

export async function getWorkoutWithExercisesAndSets(workoutId: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      workoutDate: workouts.date,
      workoutExerciseId: workoutExercises.id,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
      completed: sets.completed,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .orderBy(workoutExercises.order, sets.setNumber)

  if (rows.length === 0) return null

  const exercisesMap = new Map<
    number,
    {
      workoutExerciseId: number
      exerciseId: number
      exerciseName: string
      order: number
      sets: {
        id: number
        setNumber: number
        reps: number | null
        weight: string | null
        completed: boolean
      }[]
    }
  >()

  const firstRow = rows[0]

  for (const row of rows) {
    if (
      row.workoutExerciseId !== null &&
      row.exerciseId !== null &&
      row.exerciseName !== null &&
      row.exerciseOrder !== null
    ) {
      if (!exercisesMap.has(row.workoutExerciseId)) {
        exercisesMap.set(row.workoutExerciseId, {
          workoutExerciseId: row.workoutExerciseId,
          exerciseId: row.exerciseId,
          exerciseName: row.exerciseName,
          order: row.exerciseOrder,
          sets: [],
        })
      }
      const exercise = exercisesMap.get(row.workoutExerciseId)!

      if (row.setId !== null && row.setNumber !== null) {
        exercise.sets.push({
          id: row.setId,
          setNumber: row.setNumber,
          reps: row.reps,
          weight: row.weight,
          completed: row.completed ?? true,
        })
      }
    }
  }

  return {
    id: firstRow.workoutId,
    name: firstRow.workoutName,
    date: firstRow.workoutDate,
    exercises: Array.from(exercisesMap.values()).sort(
      (a, b) => a.order - b.order
    ),
  }
}

export async function createExercise(data: { name: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const result = await db
    .insert(exercises)
    .values({ name: data.name })
    .returning({ id: exercises.id })

  return result[0]
}

export async function addExerciseToWorkout(data: {
  workoutId: number
  exerciseId: number
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify workout ownership
  const workout = await db
    .select({ id: workouts.id })
    .from(workouts)
    .where(and(eq(workouts.id, data.workoutId), eq(workouts.userId, userId)))
    .limit(1)

  if (!workout[0]) throw new Error('Unauthorized')

  // Get next order
  const maxOrderResult = await db
    .select({ maxOrder: max(workoutExercises.order) })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, data.workoutId))

  const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1

  await db.insert(workoutExercises).values({
    workoutId: data.workoutId,
    exerciseId: data.exerciseId,
    order: nextOrder,
  })
}

export async function removeExerciseFromWorkout(data: {
  workoutExerciseId: number
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership via join
  const row = await db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.id, data.workoutExerciseId),
        eq(workouts.userId, userId)
      )
    )
    .limit(1)

  if (!row[0]) throw new Error('Unauthorized')

  await db
    .delete(workoutExercises)
    .where(eq(workoutExercises.id, data.workoutExerciseId))
}

export async function addSet(data: {
  workoutExerciseId: number
  reps?: number
  weight?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership
  const row = await db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.id, data.workoutExerciseId),
        eq(workouts.userId, userId)
      )
    )
    .limit(1)

  if (!row[0]) throw new Error('Unauthorized')

  // Get next set number
  const maxSetResult = await db
    .select({ maxSetNumber: max(sets.setNumber) })
    .from(sets)
    .where(eq(sets.workoutExerciseId, data.workoutExerciseId))

  const nextSetNumber = (maxSetResult[0]?.maxSetNumber ?? 0) + 1

  await db.insert(sets).values({
    workoutExerciseId: data.workoutExerciseId,
    setNumber: nextSetNumber,
    reps: data.reps ?? null,
    weight: data.weight ?? null,
  })
}

export async function updateSet(data: {
  setId: number
  reps?: number
  weight?: string
  completed?: boolean
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership via join
  const row = await db
    .select({ id: sets.id })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(sets.id, data.setId), eq(workouts.userId, userId)))
    .limit(1)

  if (!row[0]) throw new Error('Unauthorized')

  await db
    .update(sets)
    .set({
      reps: data.reps !== undefined ? data.reps : undefined,
      weight: data.weight !== undefined ? data.weight : undefined,
      completed: data.completed !== undefined ? data.completed : undefined,
    })
    .where(eq(sets.id, data.setId))
}

export async function deleteSet(data: { setId: number }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership via join
  const row = await db
    .select({ id: sets.id })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(sets.id, data.setId), eq(workouts.userId, userId)))
    .limit(1)

  if (!row[0]) throw new Error('Unauthorized')

  await db.delete(sets).where(eq(sets.id, data.setId))
}

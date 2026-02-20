import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { workouts, workoutExercises, exercises, sets } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function getWorkoutsForDate(date: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      workoutExerciseId: workoutExercises.id,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)))
    .orderBy(workouts.id, workoutExercises.order, sets.setNumber)

  const workoutsMap = new Map<
    number,
    {
      id: number
      name: string | null
      exercises: Map<
        number,
        {
          name: string
          order: number
          sets: { setNumber: number; reps: number | null; weight: string | null }[]
        }
      >
    }
  >()

  for (const row of rows) {
    if (!workoutsMap.has(row.workoutId)) {
      workoutsMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        exercises: new Map(),
      })
    }
    const workout = workoutsMap.get(row.workoutId)!

    if (
      row.workoutExerciseId !== null &&
      row.exerciseName !== null &&
      row.exerciseOrder !== null
    ) {
      if (!workout.exercises.has(row.workoutExerciseId)) {
        workout.exercises.set(row.workoutExerciseId, {
          name: row.exerciseName,
          order: row.exerciseOrder,
          sets: [],
        })
      }
      const exercise = workout.exercises.get(row.workoutExerciseId)!

      if (row.setId !== null && row.setNumber !== null) {
        exercise.sets.push({
          setNumber: row.setNumber,
          reps: row.reps,
          weight: row.weight,
        })
      }
    }
  }

  return Array.from(workoutsMap.values()).map((w) => ({
    id: w.id,
    name: w.name,
    exercises: Array.from(w.exercises.values())
      .sort((a, b) => a.order - b.order)
      .map((e) => ({
        name: e.name,
        sets: e.sets,
      })),
  }))
}

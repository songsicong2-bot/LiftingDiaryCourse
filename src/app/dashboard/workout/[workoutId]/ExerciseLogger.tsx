'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ExerciseCard } from './ExerciseCard'
import { AddExercisePanel } from './AddExercisePanel'

interface Exercise {
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

interface ExerciseLoggerProps {
  workoutId: number
  exercises: Exercise[]
  allExercises: { id: number; name: string }[]
}

export function ExerciseLogger({
  workoutId,
  exercises,
  allExercises,
}: ExerciseLoggerProps) {
  const [showAddPanel, setShowAddPanel] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Exercises</h2>
        {!showAddPanel && (
          <Button
            onClick={() => setShowAddPanel(true)}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            Add Exercise
          </Button>
        )}
      </div>

      {/* Exercise cards */}
      {exercises.length === 0 && !showAddPanel && (
        <p className="text-sm text-zinc-500">
          No exercises yet. Add one to get started.
        </p>
      )}

      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.workoutExerciseId}
          workoutId={workoutId}
          workoutExerciseId={exercise.workoutExerciseId}
          exerciseName={exercise.exerciseName}
          sets={exercise.sets}
        />
      ))}

      {/* Add exercise panel */}
      {showAddPanel && (
        <AddExercisePanel
          workoutId={workoutId}
          allExercises={allExercises}
          onClose={() => setShowAddPanel(false)}
        />
      )}
    </div>
  )
}

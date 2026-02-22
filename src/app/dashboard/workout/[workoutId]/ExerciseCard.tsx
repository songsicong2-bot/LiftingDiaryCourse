'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SetRow } from './SetRow'
import { AddSetForm } from './AddSetForm'
import { removeExerciseFromWorkoutAction } from './actions'

interface ExerciseCardProps {
  workoutId: number
  workoutExerciseId: number
  exerciseName: string
  sets: {
    id: number
    setNumber: number
    reps: number | null
    weight: string | null
    completed: boolean
  }[]
}

export function ExerciseCard({
  workoutId,
  workoutExerciseId,
  exerciseName,
  sets,
}: ExerciseCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRemove() {
    startTransition(async () => {
      await removeExerciseFromWorkoutAction({ workoutExerciseId, workoutId })
      router.refresh()
    })
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 gap-4 py-4">
      <CardHeader>
        <CardTitle className="text-zinc-100 text-base">{exerciseName}</CardTitle>
        <CardAction>
          <Button
            onClick={handleRemove}
            disabled={isPending}
            variant="ghost"
            size="icon-sm"
            className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50"
          >
            <XIcon className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {sets.map((set) => (
          <SetRow
            key={set.id}
            setId={set.id}
            workoutId={workoutId}
            setNumber={set.setNumber}
            initialReps={set.reps}
            initialWeight={set.weight}
            completed={set.completed}
          />
        ))}
        <AddSetForm workoutExerciseId={workoutExerciseId} workoutId={workoutId} />
      </CardContent>
    </Card>
  )
}

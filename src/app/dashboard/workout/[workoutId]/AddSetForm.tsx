'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addSetAction } from './actions'

interface AddSetFormProps {
  workoutExerciseId: number
  workoutId: number
}

export function AddSetForm({ workoutExerciseId, workoutId }: AddSetFormProps) {
  const router = useRouter()
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    const repsNum = reps.trim() ? parseInt(reps, 10) : undefined
    const weightStr = weight.trim() || undefined

    startTransition(async () => {
      await addSetAction({
        workoutExerciseId,
        workoutId,
        reps: repsNum,
        weight: weightStr,
      })
      setReps('')
      setWeight('')
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <Input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        className="w-20 h-8 text-sm border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
      />
      <span className="text-zinc-500 text-sm">×</span>
      <Input
        type="number"
        step="0.5"
        placeholder="kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-24 h-8 text-sm border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
      />
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        size="sm"
        className="h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
      >
        <PlusIcon className="size-3" />
      </Button>
    </div>
  )
}

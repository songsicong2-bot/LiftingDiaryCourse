'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateSetAction, deleteSetAction } from './actions'

interface SetRowProps {
  setId: number
  workoutId: number
  setNumber: number
  initialReps: number | null
  initialWeight: string | null
  completed: boolean
}

export function SetRow({
  setId,
  workoutId,
  setNumber,
  initialReps,
  initialWeight,
}: SetRowProps) {
  const router = useRouter()
  const [reps, setReps] = useState(initialReps?.toString() ?? '')
  const [weight, setWeight] = useState(initialWeight ?? '')
  const [isPending, startTransition] = useTransition()

  function handleBlur() {
    const repsNum = reps.trim() ? parseInt(reps, 10) : undefined
    const weightStr = weight.trim() || undefined

    startTransition(async () => {
      await updateSetAction({
        setId,
        workoutId,
        reps: repsNum,
        weight: weightStr,
      })
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteSetAction({ setId, workoutId })
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 w-6 shrink-0">
        S{setNumber}
      </span>
      <Input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={handleBlur}
        placeholder="—"
        className="w-20 h-8 text-sm border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
      />
      <span className="text-zinc-500 text-sm">×</span>
      <Input
        type="number"
        step="0.5"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={handleBlur}
        placeholder="—"
        className="w-24 h-8 text-sm border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
      />
      <span className="text-xs text-zinc-500">kg</span>
      <Button
        onClick={handleDelete}
        disabled={isPending}
        variant="ghost"
        size="icon-sm"
        className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50 ml-auto"
      >
        <Trash2Icon className="size-3.5" />
      </Button>
    </div>
  )
}

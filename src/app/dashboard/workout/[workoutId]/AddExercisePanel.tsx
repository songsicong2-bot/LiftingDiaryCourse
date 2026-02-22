'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addExerciseToWorkoutAction, createAndAddExerciseAction } from './actions'

interface AddExercisePanelProps {
  workoutId: number
  allExercises: { id: number; name: string }[]
  onClose: () => void
}

export function AddExercisePanel({
  workoutId,
  allExercises,
  onClose,
}: AddExercisePanelProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [selectedId, setSelectedId] = useState<string>('')
  const [newName, setNewName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAddExisting() {
    if (!selectedId) return
    setError(null)

    startTransition(async () => {
      await addExerciseToWorkoutAction({
        workoutId,
        exerciseId: parseInt(selectedId, 10),
      })
      router.refresh()
      onClose()
    })
  }

  function handleCreateAndAdd() {
    if (!newName.trim()) return
    setError(null)

    startTransition(async () => {
      try {
        await createAndAddExerciseAction({ workoutId, name: newName.trim() })
        router.refresh()
        onClose()
      } catch {
        setError('An exercise with this name already exists.')
      }
    })
  }

  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-900 p-4 flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => { setMode('existing'); setError(null) }}
          variant={mode === 'existing' ? 'default' : 'outline'}
          size="sm"
          className={
            mode === 'existing'
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
          }
        >
          Pick existing
        </Button>
        <Button
          onClick={() => { setMode('new'); setError(null) }}
          variant={mode === 'new' ? 'default' : 'outline'}
          size="sm"
          className={
            mode === 'new'
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
          }
        >
          Create new
        </Button>
      </div>

      {mode === 'existing' ? (
        <div className="flex items-center gap-2">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-100 h-9">
              <SelectValue placeholder="Select an exercise…" />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              {allExercises.map((ex) => (
                <SelectItem
                  key={ex.id}
                  value={ex.id.toString()}
                  className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                >
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddExisting}
            disabled={isPending || !selectedId}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
          >
            Add
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Exercise name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-9"
            />
            <Button
              onClick={handleCreateAndAdd}
              disabled={isPending || !newName.trim()}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              Create &amp; Add
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      )}

      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="w-fit text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 px-2"
      >
        Cancel
      </Button>
    </div>
  )
}

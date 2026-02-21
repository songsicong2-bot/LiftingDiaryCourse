import { notFound } from 'next/navigation'
import { DumbbellIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getWorkoutById } from '@/data/workouts'
import { EditWorkoutForm } from './EditWorkoutForm'

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({
  params,
}: EditWorkoutPageProps) {
  const { workoutId } = await params
  const id = parseInt(workoutId, 10)
  if (isNaN(id)) notFound()

  const workout = await getWorkoutById(id)
  if (!workout) notFound()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500/30">
          <DumbbellIcon className="size-4" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-zinc-100">
          Lifting Diary
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Page heading */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 h-8 px-3 text-xs"
          >
            <Link href="/dashboard">← Back</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Edit Workout
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Update your workout details.
            </p>
          </div>
        </div>

        <EditWorkoutForm
          workoutId={workout.id}
          initialName={workout.name}
          initialDate={workout.date}
        />
      </main>
    </div>
  )
}

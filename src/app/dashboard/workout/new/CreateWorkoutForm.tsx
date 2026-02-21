'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { createWorkoutAction } from './actions'

export function CreateWorkoutForm() {
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      await createWorkoutAction({
        name: name.trim() || undefined,
        date: format(date, 'yyyy-MM-dd'),
      })
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Workout name */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Name <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <Input
          type="text"
          placeholder="e.g. Push Day, Leg Day…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10"
        />
      </div>

      {/* Date picker */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Date
        </label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-fit gap-2 border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 text-sm font-medium px-4 h-10 rounded-lg transition-colors"
            >
              <CalendarIcon className="size-4 text-orange-500" />
              {format(date, 'do MMM yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 border-zinc-700 bg-zinc-900 shadow-xl shadow-black/40"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate)
                  setCalendarOpen(false)
                }
              }}
              defaultMonth={date}
              className="bg-zinc-900 text-zinc-100"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-fit bg-orange-500 hover:bg-orange-600 text-white font-semibold h-10 px-6 rounded-lg shadow-md shadow-orange-500/20 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create Workout'}
      </Button>
    </div>
  )
}

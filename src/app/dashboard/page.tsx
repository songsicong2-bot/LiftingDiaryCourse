"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, DumbbellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const today = new Date();

type Exercise = {
  name: string;
  sets: { reps: number; weightKg: number }[];
};

type Workout = {
  id: number;
  date: Date;
  name: string;
  exercises: Exercise[];
};

const WORKOUTS: Workout[] = [
  {
    id: 1,
    date: today,
    name: "Upper Body — Push",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { reps: 5, weightKg: 100 },
          { reps: 5, weightKg: 105 },
          { reps: 3, weightKg: 110 },
        ],
      },
      {
        name: "Overhead Press",
        sets: [
          { reps: 8, weightKg: 60 },
          { reps: 8, weightKg: 62.5 },
          { reps: 6, weightKg: 65 },
        ],
      },
      {
        name: "Incline Dumbbell Press",
        sets: [
          { reps: 10, weightKg: 32 },
          { reps: 10, weightKg: 32 },
          { reps: 8, weightKg: 34 },
        ],
      },
    ],
  },
  {
    id: 2,
    date: today,
    name: "Accessory — Triceps & Shoulders",
    exercises: [
      {
        name: "Tricep Pushdown",
        sets: [
          { reps: 12, weightKg: 25 },
          { reps: 12, weightKg: 27.5 },
          { reps: 10, weightKg: 30 },
        ],
      },
      {
        name: "Lateral Raise",
        sets: [
          { reps: 15, weightKg: 10 },
          { reps: 15, weightKg: 10 },
          { reps: 12, weightKg: 12 },
        ],
      },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const workoutsForDate = WORKOUTS.filter((w) =>
    isSameDay(w.date, selectedDate)
  );

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Review your workouts for any date.
          </p>
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
                {format(selectedDate, "do MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-zinc-700 bg-zinc-900 shadow-xl shadow-black/40"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
                defaultMonth={selectedDate}
                className="bg-zinc-900 text-zinc-100"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Workout list */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Workouts
            </label>
            <span className="text-xs text-zinc-600">
              {format(selectedDate, "do MMM yyyy")}
            </span>
          </div>

          {workoutsForDate.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-14 gap-3 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-500">
                <DumbbellIcon className="size-5" />
              </div>
              <p className="text-sm text-zinc-400 font-medium">
                No workouts logged
              </p>
              <p className="text-xs text-zinc-600 max-w-xs">
                Select a different date or log a new workout for{" "}
                {format(selectedDate, "do MMM yyyy")}.
              </p>
            </div>
          ) : (
            workoutsForDate.map((workout) => (
              <Card
                key={workout.id}
                className="border-zinc-800 bg-zinc-900 shadow-none"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-100">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/15 text-orange-400">
                      <DumbbellIcon className="size-3.5" />
                    </span>
                    {workout.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.name} className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-zinc-300">
                        {exercise.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.sets.map((set, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300"
                          >
                            <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
                              S{i + 1}
                            </span>
                            <span className="font-semibold text-zinc-100">
                              {set.reps}
                            </span>
                            <span className="text-zinc-500">×</span>
                            <span className="font-semibold text-orange-400">
                              {set.weightKg}kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

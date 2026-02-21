import { format, parseISO } from "date-fns";
import { DumbbellIcon } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import DatePicker from "./DatePicker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const selectedDate = dateParam ?? format(new Date(), "yyyy-MM-dd");
  const displayDate = parseISO(selectedDate);

  const workoutsData = await getWorkoutsForDate(selectedDate);

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
          <DatePicker selectedDate={selectedDate} />
        </div>

        {/* Workout list */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Workouts
            </label>
            <span className="text-xs text-zinc-600">
              {format(displayDate, "do MMM yyyy")}
            </span>
          </div>

          {workoutsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-14 gap-3 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-500">
                <DumbbellIcon className="size-5" />
              </div>
              <p className="text-sm text-zinc-400 font-medium">
                No workouts logged
              </p>
              <p className="text-xs text-zinc-600 max-w-xs">
                Select a different date or log a new workout for{" "}
                {format(displayDate, "do MMM yyyy")}.
              </p>
            </div>
          ) : (
            workoutsData.map((workout) => (
              <Link
                key={workout.id}
                href={`/dashboard/workout/${workout.id}`}
                className="block"
              >
              <Card
                className="border-zinc-800 bg-zinc-900 shadow-none transition-colors hover:border-zinc-600 hover:bg-zinc-800"
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
                              {set.weight}kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

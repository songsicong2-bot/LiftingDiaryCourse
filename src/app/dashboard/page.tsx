import { format, parseISO } from "date-fns";
import { DumbbellIcon } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-950 text-white pt-16">
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Review your workouts for any date.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Calendar */}
          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Select Date
            </label>
            <DatePicker selectedDate={selectedDate} />
          </div>

          {/* Workout list */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Workouts
                </label>
                <p className="text-base font-semibold text-zinc-200 mt-0.5">
                  {format(displayDate, "do MMM yyyy")}
                </p>
              </div>
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
                                {set.weight}kg
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
        </div>
      </main>
    </div>
  );
}

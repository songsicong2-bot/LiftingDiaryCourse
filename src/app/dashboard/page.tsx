import { format, parseISO } from "date-fns";
import { DumbbellIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background text-foreground pt-16">
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your workouts for any date.
          </p>
        </div>

        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Workouts
              </label>
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm font-medium gap-1.5"
                >
                  <Link href={`/dashboard/workout/new?date=${selectedDate}`}>
                    <PlusIcon className="size-3.5" />
                    Log New Workout
                  </Link>
                </Button>
                <DatePicker selectedDate={selectedDate} />
              </div>
            </div>

            {workoutsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-14 gap-3 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground">
                  <DumbbellIcon className="size-5" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  No workouts logged
                </p>
                <p className="text-xs text-muted-foreground/70 max-w-xs">
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
                  <Card className="border-border bg-card shadow-none transition-colors hover:bg-accent/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/15 text-orange-500">
                          <DumbbellIcon className="size-3.5" />
                        </span>
                        {workout.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.name} className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-foreground/80">
                            {exercise.name}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {exercise.sets.map((set, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs"
                              >
                                <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                                  S{i + 1}
                                </span>
                                <span className="font-semibold">
                                  {set.reps}
                                </span>
                                <span className="text-muted-foreground">×</span>
                                <span className="font-semibold text-orange-500">
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

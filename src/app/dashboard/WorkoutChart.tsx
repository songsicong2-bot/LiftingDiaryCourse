import { TrendingUpIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkoutVolumeHistory } from "@/data/workouts"

import { WorkoutChartClient } from "./WorkoutChartClient"

export default async function WorkoutChart() {
  const data = await getWorkoutVolumeHistory()

  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/15 text-orange-500">
            <TrendingUpIcon className="size-3.5" />
          </span>
          Volume — Last 30 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WorkoutChartClient data={data} />
      </CardContent>
    </Card>
  )
}

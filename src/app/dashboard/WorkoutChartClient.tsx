"use client"

import { format, parseISO } from "date-fns"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  volume: {
    label: "Volume (kg)",
    color: "rgb(249 115 22)",
  },
} satisfies ChartConfig

interface WorkoutChartClientProps {
  data: { date: string; volume: number }[]
}

export function WorkoutChartClient({ data }: WorkoutChartClientProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No workout data yet. Start logging workouts to see your volume chart.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(249 115 22)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="rgb(249 115 22)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
          tickFormatter={(value: string) => format(parseISO(value), "MMM d")}
          interval="preserveStartEnd"
          className="fill-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
          tickFormatter={(value: number) => {
            if (value >= 1000) {
              const k = value / 1000
              return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
            }
            return String(value)
          }}
          className="fill-muted-foreground"
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label: string) =>
                format(parseISO(label), "do MMM yyyy")
              }
              formatter={(value) => [
                `${Number(value).toLocaleString()} kg`,
                "Volume",
              ]}
            />
          }
        />
        <Area
          dataKey="volume"
          type="monotone"
          fill="url(#volumeGradient)"
          stroke="rgb(249 115 22)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "rgb(249 115 22)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

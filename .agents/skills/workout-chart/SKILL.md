---
name: workout-chart
description: Generates a monthly workout frequency bar chart (PNG) from the PostgreSQL database. Use when the user wants to visualise or report workout activity over the past 12 months. Queries the `workouts` table via DATABASE_URL in .env, groups by calendar month, and exports a bar chart image to .agents/skills/workout-chart/scripts/workout_chart.png.
---

# Workout Chart

## Overview

Generates a bar chart PNG showing workout frequency by month for the past 12 months, sourced from the PostgreSQL `workouts` table.

## Prerequisites

- `uv` must be available on the PATH
- `.env` in the project root must contain a valid `DATABASE_URL` pointing to the PostgreSQL database

## Usage

Run the script with `uv` (dependencies are declared inline and managed automatically):

```bash
uv run .agents/skills/workout-chart/scripts/workout_chart.py
```

## Output

- Chart saved to: `.agents/skills/workout-chart/scripts/workout_chart.png`
- The script also prints monthly workout counts to stdout

## How It Works

1. Loads `DATABASE_URL` from `.env` (located one level above `.agents/`)
2. Connects to PostgreSQL and queries the `workouts` table for the past 12 months, grouped by month
3. Builds a full 12-month series (filling months with 0 if no workouts were recorded)
4. Plots a bar chart using matplotlib and saves it as a PNG

## scripts/

- `workout_chart.py` — the main script; run it directly with `uv run`

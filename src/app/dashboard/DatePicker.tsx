"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

export default function DatePicker({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const date = parseISO(selectedDate);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          if (newDate) {
            router.push(`/dashboard?date=${format(newDate, "yyyy-MM-dd")}`);
          }
        }}
        defaultMonth={date}
        className="w-full"
      />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

export default function DatePicker({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const date = parseISO(selectedDate);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 w-fit shadow-lg shadow-black/20">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          if (newDate) {
            router.push(`/dashboard?date=${format(newDate, "yyyy-MM-dd")}`);
            router.refresh();
          }
        }}
        defaultMonth={date}
        classNames={{
          today:
            "bg-orange-500/20 text-orange-300 rounded-md data-[selected=true]:rounded-none",
        }}
        className="text-zinc-100"
      />
    </div>
  );
}

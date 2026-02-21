"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const date = parseISO(selectedDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-fit gap-2 border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 text-sm font-medium px-4 h-10 rounded-lg transition-colors"
        >
          <CalendarIcon className="size-4 text-orange-500" />
          {format(date, "do MMM yyyy")}
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
              router.push(`/dashboard?date=${format(newDate, "yyyy-MM-dd")}`);
              router.refresh();
              setOpen(false);
            }
          }}
          defaultMonth={date}
          className="bg-zinc-900 text-zinc-100"
        />
      </PopoverContent>
    </Popover>
  );
}

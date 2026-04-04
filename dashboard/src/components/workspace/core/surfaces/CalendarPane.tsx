"use client";

import CalendarFull from "@/components/calendar/CalendarFull";
import { INITIAL_WORKSTATIONS } from "@/lib/constants";

export default function CalendarPane() {
  return <CalendarFull workstations={INITIAL_WORKSTATIONS} />;
}

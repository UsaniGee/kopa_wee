const LAGOS_OFFSET_MS = 60 * 60 * 1000; // West Africa Time, UTC+1, no daylight saving

/** YYYYMMDD of the calendar day in Nigeria, shifted by `addDays`. */
function lagosDay(date: Date, addDays = 0): string {
  const d = new Date(date.getTime() + LAGOS_OFFSET_MS + addDays * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/** Google Calendar "add event" link for an all-day event on the Nigerian calendar day of `date`. */
export function googleCalendarAllDayLink({
  title,
  date,
  details,
  location,
}: {
  title: string;
  date: string | Date;
  details?: string;
  location?: string;
}): string {
  const day = new Date(date);
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${lagosDay(day)}/${lagosDay(day, 1)}` });
  if (details) params.set("details", details);
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

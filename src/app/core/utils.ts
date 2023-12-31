export function getHoursDiff(dateString1: string, dateString2: string): number {
  return (
    (new Date(dateString1).getTime() - new Date(dateString2).getTime()) /
    3600000
  );
}

export function isSameDay(dateString1: string, dateString2: string): boolean {
  return (
    new Date(dateString1).toDateString() ===
    new Date(dateString2).toDateString()
  );
}

export function getDatePortionString(dateString: string): string {
  return new Date(dateString).toDateString();
}

export function getHoursUntilEndOfDay(dateString: string): number {
  const date = new Date(dateString);
  const timezoneOffsetInMilliseconds = date.getTimezoneOffset() * 60000;
  const dateInMilliseconds = date.getTime() - timezoneOffsetInMilliseconds;
  const endOfDayInMilliseconds =
    dateInMilliseconds - (dateInMilliseconds % 86400000) + 86400000;
  return (endOfDayInMilliseconds - dateInMilliseconds) / 3600000;
}

export function getHoursFromStartOfDay(dateString: string): number {
  const date = new Date(dateString);
  const timezoneOffsetInMilliseconds = date.getTimezoneOffset() * 60000;
  const dateInMilliseconds = date.getTime() - timezoneOffsetInMilliseconds;
  const startOfDayInMilliseconds =
    dateInMilliseconds - (dateInMilliseconds % 86400000);
  return (dateInMilliseconds - startOfDayInMilliseconds) / 3600000;
}

export function getDateWithoutTimezone(date: Date): string {
  const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  const withoutTimezone = new Date(date.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return withoutTimezone;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

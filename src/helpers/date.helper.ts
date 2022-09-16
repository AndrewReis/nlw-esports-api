export function convertHourStringToMinutes(hourString: string): number {
  const [hour, minute] = hourString.split(':').map(Number);
  const minutesAmount = (hour * 60) + minute;
  return minutesAmount;
}

export function convertHourMinutesToString(minutesAmount: number): string {
  const hour    = Math.floor(minutesAmount / 60);
  const minutes = minutesAmount % 60;
  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
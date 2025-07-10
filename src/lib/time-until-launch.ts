export function getTimeUntilLaunch(): { days: number; hours: number; minutes: number } {
  const launchDate = new Date("2025-08-16T08:00:00-04:00"); // Aug 16, 8am EDT (Toronto)
  const now = new Date();

  const diffMs = launchDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0 }; // already launched
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
}
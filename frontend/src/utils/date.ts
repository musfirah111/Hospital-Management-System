import { format, isWeekend } from 'date-fns';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Invalid date';
  }
  return format(date, 'MMMM d, yyyy');
}

export const getAvailableSlots = (workingHours: Array<{ day: string; slots: string[] }>, date: string): string[] => {
  const selectedDate = new Date(date);
  const dayOfWeek = format(selectedDate, 'EEEE');
  
  if (isWeekend(selectedDate)) {
    const weekendSchedule = workingHours.find(schedule => schedule.day === 'Saturday');
    return weekendSchedule?.slots || [];
  }
  
  const schedule = workingHours.find(schedule => schedule.day === dayOfWeek);
  return schedule?.slots || [];
};
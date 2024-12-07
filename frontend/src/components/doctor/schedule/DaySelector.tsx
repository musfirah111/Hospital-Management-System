import { format, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DaySelector({ selectedDate, onDateChange }: DaySelectorProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="flex items-center space-x-4 mb-6">
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      
      <div className="flex-1 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => onDateChange(day)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isSameDay(day, selectedDate)
                ? 'bg-[#0B8FAC] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xs font-medium">
              {format(day, 'EEE')}
            </span>
            <span className="text-lg font-semibold">
              {format(day, 'd')}
            </span>
          </button>
        ))}
      </div>

      <button className="p-2 hover:bg-gray-100 rounded-full">
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
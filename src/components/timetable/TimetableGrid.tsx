import { type TimetableSlot, DAY_NAMES, TIME_SLOTS, formatTime, COURSE_TYPE_INFO } from '@/types/database';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TimetableGridProps {
  slots: TimetableSlot[];
  onSlotClick?: (slot: TimetableSlot) => void;
}

export function TimetableGrid({ slots, onSlotClick }: TimetableGridProps) {
  // Create a map for quick lookup
  const slotMap = new Map<string, TimetableSlot>();
  slots.forEach(slot => {
    const key = `${slot.day_of_week}-${slot.start_hour}`;
    slotMap.set(key, slot);
  });

  const getCourseTypeClass = (type: string) => {
    switch (type) {
      case 'MAJOR': return 'course-major';
      case 'MINOR': return 'course-minor';
      case 'SEC': return 'course-sec';
      case 'AEC': return 'course-aec';
      case 'VAC': return 'course-vac';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="overflow-auto rounded-xl border border-border bg-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="border-b border-r border-border p-3 text-left text-sm font-semibold text-muted-foreground w-24">
              Time
            </th>
            {DAY_NAMES.map((day) => (
              <th key={day} className="border-b border-r border-border p-3 text-center text-sm font-semibold text-foreground min-w-[140px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.slice(0, -1).map((hour) => (
            <tr key={hour} className="hover:bg-muted/30 transition-colors">
              <td className="border-b border-r border-border p-2 text-xs font-medium text-muted-foreground bg-muted/20">
                {formatTime(hour)}
              </td>
              {DAY_NAMES.map((_, dayIndex) => {
                const slot = slotMap.get(`${dayIndex}-${hour}`);
                return (
                  <td key={dayIndex} className="border-b border-r border-border p-1">
                    {slot && slot.course ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              'timetable-cell cursor-pointer',
                              getCourseTypeClass(slot.course.course_type)
                            )}
                            onClick={() => onSlotClick?.(slot)}
                          >
                            <div className="font-semibold truncate">{slot.course.code}</div>
                            <div className="text-[10px] opacity-80 truncate">{slot.room?.name}</div>
                            <div className="text-[10px] opacity-70 truncate">{slot.faculty?.name}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">{slot.course.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {COURSE_TYPE_INFO[slot.course.course_type]?.label} • {slot.course.credits} Credits
                            </p>
                            <p className="text-xs">Faculty: {slot.faculty?.name}</p>
                            <p className="text-xs">Room: {slot.room?.name}</p>
                            <p className="text-xs">Department: {slot.course.department?.name}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="h-16 rounded-md bg-muted/20" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Legend component
export function TimetableLegend() {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Course Types:</span>
      {Object.entries(COURSE_TYPE_INFO).map(([type, info]) => (
        <div key={type} className="flex items-center gap-2">
          <div className={cn('w-4 h-4 rounded', `course-${type.toLowerCase()}`)} />
          <span className="text-sm">{info.label}</span>
        </div>
      ))}
    </div>
  );
}

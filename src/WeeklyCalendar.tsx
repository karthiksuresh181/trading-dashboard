import { MessageSquareWarning } from "lucide-react";

const WeeklyCalendar = () => {
  // Get current date and start of week
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);

  // Generate week days with dates
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      name: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
      highlighted: [1, 2, 4].includes(date.getDay()), // Monday, Tuesday, Thursday
      isWednesday: date.getDay() === 3,
    };
  });

  return (
    <div className="w-full p-4 bg-neutral-900 rounded-lg border border-neutral-800">
      <h2 className="text-lg font-semibold text-neutral-200 mb-4">
        {monday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (Week {Math.ceil(today.getDate() / 7)})
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <div
            key={day.name}
            className={`
              p-4 rounded-lg border transition-all duration-200
              min-w-[120px] flex-1
              ${day.highlighted
                ? 'bg-neutral-800 border-neutral-600'
                : 'bg-neutral-900 border-neutral-800'
              }
              ${day.isToday && day.highlighted
                ? 'border-green-600'
                : ''
              }
            `}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-center">
                  <span className={`font-medium text-neutral-200`}>
                    {day.name}
                  </span>
                  <div className={`text-md mt-1 ${day.isToday
                    ? 'text-neutral-100'
                    : 'text-neutral-400'
                    }`}>
                    {day.date}
                  </div>
                </div>
                {day.highlighted && day.isToday && (
                  <span className={`w-3 h-3 rounded-full animate-pulse ${day.isToday ? 'bg-green-400' : 'bg-neutral-400'} `} />
                )}
                {day.isToday && day.isWednesday && (
                  <div className="group relative">
                    <MessageSquareWarning
                      className="w-5 h-5 rounded-full animate-pulse text-amber-600 hover:text-amber-400 cursor-help"
                    />
                    <div className="absolute bottom-full left-0 mb-0 hidden group-hover:block">
                      <div className="text-neutral-200 text-xs rounded p-2 shadow-lg whitespace-nowrap">
                        Trade only if no entries on Monday & Tuesday
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
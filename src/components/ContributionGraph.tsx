"use client";

import { ContributionWeek } from '@/lib/github';
import { useState } from 'react';

interface ContributionGraphProps {
    weeks: ContributionWeek[];
}

const LEVEL_COLORS = [
    'rgba(148, 163, 184, 0.2)', // level 0 - slate-400/20
    'rgba(34, 197, 94, 0.3)',   // level 1 - green-500/30
    'rgba(34, 197, 94, 0.5)',   // level 2 - green-500/50
    'rgba(34, 197, 94, 0.7)',   // level 3 - green-500/70
    'rgba(34, 197, 94, 1)'      // level 4 - green-500/100
];

export default function ContributionGraph({ weeks }: ContributionGraphProps) {
    const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (date: string, count: number, event: React.MouseEvent) => {
        setHoveredDay({ date, count });
        setMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredDay(null);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (hoveredDay) {
            setMousePos({ x: event.clientX, y: event.clientY });
        }
    };

    // Get month labels for the top
    const getMonthLabels = () => {
        const labels: { month: string; weekIndex: number; span: number }[] = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let lastMonthIndex = -1;

        weeks.forEach((week, weekIndex) => {
            // Find if any day in this week is the 1st of a month
            const firstOfMonth = week.days.find(day => day.date.endsWith('-01'));

            if (firstOfMonth) {
                const date = new Date(firstOfMonth.date);
                const monthIndex = date.getMonth();

                if (monthIndex !== lastMonthIndex) {
                    if (labels.length > 0) {
                        labels[labels.length - 1].span = weekIndex - labels[labels.length - 1].weekIndex;
                    }
                    labels.push({ month: monthNames[monthIndex], weekIndex, span: 0 });
                    lastMonthIndex = monthIndex;
                }
            } else if (weekIndex === 0 && week.days.length > 0) {
                // For the very first week, even if it's not the 1st
                const date = new Date(week.days[0].date);
                const monthIndex = date.getMonth();
                labels.push({ month: monthNames[monthIndex], weekIndex, span: 0 });
                lastMonthIndex = monthIndex;
            }
        });

        if (labels.length > 0) {
            labels[labels.length - 1].span = weeks.length - labels[labels.length - 1].weekIndex;
        }

        return labels;
    };

    const monthLabels = getMonthLabels();

    // Determine which days of the week are actually present in the grid
    const getDayLabels = () => {
        // Find the first week with data to determine starting day
        const firstWeek = weeks.find(week => week.days.length > 0);
        if (!firstWeek || firstWeek.days.length === 0) return [];

        // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
        const firstDate = new Date(firstWeek.days[0].date);
        const startDayOfWeek = firstDate.getDay();

        // GitHub always shows 7 rows, so we show all days but align them correctly
        const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Return all days - the grid will handle alignment
        return allDays;
    };

    const dayLabels = getDayLabels();

    return (
        <div className="relative">
            <div className="overflow-x-auto pb-4">
                <div className="inline-block min-w-full">
                    {/* Month labels Row */}
                    <div className="flex gap-1 mb-2 h-4" style={{ paddingLeft: '48px' }}>
                        {weeks.map((week, weekIndex) => {
                            const label = monthLabels.find(l => l.weekIndex === weekIndex);
                            const isNewMonth = weekIndex > 0 && week.days.length > 0 &&
                                monthLabels.some(l => l.weekIndex === weekIndex);

                            return (
                                <div
                                    key={weekIndex}
                                    className="relative flex-shrink-0"
                                    style={{
                                        width: '12px'
                                    }}
                                >
                                    {label && (
                                        <div
                                            className="absolute left-0 text-xs text-slate-400 whitespace-nowrap text-center"
                                            style={{
                                                width: `${label.span * 16}px`
                                            }}
                                        >
                                            {label.month}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-1">
                        {/* Day labels */}
                        <div className="flex flex-col gap-1 w-11 text-right pr-1">
                            <div className="h-0" /> {/* No spacer needed */}
                            {dayLabels.map((day) => (
                                <div key={day} className="text-xs text-slate-400 h-3 leading-3">
                                    {day}
                                </div>
                            ))}
                        </div>


                        <div className="flex gap-1" onMouseMove={handleMouseMove}>
                            {weeks.map((week, weekIndex) => {
                                // Check if this week starts a new month
                                const isNewMonth = weekIndex > 0 && week.days.length > 0 &&
                                    monthLabels.some(label => label.weekIndex === weekIndex);

                                // Ensure we always have 7 slots for Sunday-Saturday alignment
                                const daysByOfWeek = new Array(7).fill(null);
                                week.days.forEach(day => {
                                    const date = new Date(day.date);
                                    daysByOfWeek[date.getDay()] = day;
                                });

                                return (
                                    <div
                                        key={weekIndex}
                                        className="flex flex-col gap-1"
                                    >
                                        {daysByOfWeek.map((day, dayIndex) => (
                                            day ? (
                                                <div
                                                    key={day.date}
                                                    className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-white/50"
                                                    style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                                                    onMouseEnter={(e) => handleMouseEnter(day.date, day.count, e)}
                                                    onMouseLeave={handleMouseLeave}
                                                    title={`${day.count} contributions on ${day.date}`}
                                                />
                                            ) : (
                                                <div key={`spacer-${weekIndex}-${dayIndex}`} className="w-3 h-3" />
                                            )
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                        <span>Less</span>
                        <div className="flex gap-1">
                            {LEVEL_COLORS.map((color, idx) => (
                                <div
                                    key={idx}
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {hoveredDay && (
                <div
                    className="fixed z-50 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700 pointer-events-none"
                    style={{
                        left: `${mousePos.x + 10}px`,
                        top: `${mousePos.y - 40}px`,
                    }}
                >
                    <div className="font-semibold">{hoveredDay.count} contributions</div>
                    <div className="text-slate-400">{new Date(hoveredDay.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
            )}
        </div>
    );
}

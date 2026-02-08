"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LeetCodePieChartProps {
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
}

const COLORS = {
    Easy: '#10b981',    // green
    Medium: '#f59e0b',  // yellow/orange
    Hard: '#ef4444'     // red
};

export default function LeetCodePieChart({ easySolved, mediumSolved, hardSolved }: LeetCodePieChartProps) {
    const data = [
        { name: 'Easy', value: easySolved, color: COLORS.Easy },
        { name: 'Medium', value: mediumSolved, color: COLORS.Medium },
        { name: 'Hard', value: hardSolved, color: COLORS.Hard }
    ];

    const totalSolved = easySolved + mediumSolved + hardSolved;

    // Custom label to show total in center
    const renderCustomLabel = () => {
        return (
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-bold text-2xl"
            >
                {totalSolved}
            </text>
        );
    };

    return (
        <div className="w-full h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '8px',
                            color: '#ffffff'
                        }}
                        itemStyle={{
                            color: '#ffffff'
                        }}
                        labelStyle={{
                            color: '#ffffff'
                        }}
                        formatter={(value: number, name: string) => [value, name]}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value: string, entry: any) => (
                            <span className="text-white text-sm">
                                {value}: {entry.payload.value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center label showing total */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-3xl font-bold text-white">{totalSolved}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Total</div>
            </div>
        </div>
    );
}

import React from 'react';
import { Lead } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700/80 backdrop-blur-sm p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="font-bold text-white">{`${label}`}</p>
                <p className="text-orange-300">{`Count: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ReasonFrequencyChart: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const reasonCounts = leads
        .filter(l => l.reasonLostDelay)
        .reduce((acc, lead) => {
            const reason = lead.reasonLostDelay!;
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    const data = Object.entries(reasonCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Show top 5 reasons

    return (
        <div className="h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Top Reasons for Delay / Loss</h3>
            <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis type="number" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 121, 47, 0.1)' }}/>
                    <Bar dataKey="count" fill="#F97316" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReasonFrequencyChart;
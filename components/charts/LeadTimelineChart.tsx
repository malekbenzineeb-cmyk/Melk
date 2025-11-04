import React from 'react';
import { Lead } from '../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO, startOfWeek } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700/80 backdrop-blur-sm p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="font-bold text-white">{`Week of: ${label}`}</p>
                <p className="text-purple-300">{`New Leads: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const LeadTimelineChart: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const leadsByWeek = leads.reduce((acc, lead) => {
        const weekStart = format(startOfWeek(parseISO(lead.dateAdded)), 'yyyy-MM-dd');
        acc[weekStart] = (acc[weekStart] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(leadsByWeek)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="h-80">
            <h3 className="text-lg font-semibold text-white mb-4">New Leads Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), 'MMM d')} tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeadTimelineChart;
import React from 'react';
import { Lead } from '../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#06B6D4', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700/80 backdrop-blur-sm p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="font-bold text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const LeadSourcePieChart: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const sourceCounts = leads.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    return (
        <div className="h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: "12px"}}/>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeadSourcePieChart;
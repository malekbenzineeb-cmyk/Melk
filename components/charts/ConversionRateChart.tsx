import React from 'react';
import { Lead } from '../../types';
import { PIPELINE_STAGES } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartData {
    name: string;
    leads: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700/80 backdrop-blur-sm p-2 border border-gray-600 rounded-md shadow-lg">
                <p className="font-bold text-white">{`${label}`}</p>
                <p className="text-cyan-300">{`Leads: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ConversionRateChart: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const data: ChartData[] = PIPELINE_STAGES.map(stage => ({
        name: stage,
        leads: leads.filter(l => l.stage === stage).length,
    }));

    return (
        <div className="h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Conversion Funnel</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(12, 169, 180, 0.1)' }}/>
                    <Bar dataKey="leads" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ConversionRateChart;
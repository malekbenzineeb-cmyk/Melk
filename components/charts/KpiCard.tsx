import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
    return (
        <div className="bg-gray-800/60 p-5 rounded-xl shadow-lg">
            <h4 className="text-sm text-gray-400 font-medium uppercase tracking-wider">{title}</h4>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
    );
};

export default KpiCard;
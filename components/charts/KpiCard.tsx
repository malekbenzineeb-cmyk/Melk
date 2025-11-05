import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/60 p-5 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/80 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="text-sm text-gray-400 font-medium uppercase tracking-wider">{title}</h4>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                {icon && <div className="text-cyan-400 bg-gray-900/50 p-3 rounded-xl shadow-inner">{icon}</div>}
            </div>
        </div>
    );
};

export default KpiCard;
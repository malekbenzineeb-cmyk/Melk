import React from 'react';
import { Lead } from '../types';

interface AlertsProps {
    alerts: { lead: Lead; message: string }[];
    onEditLead: (lead: Lead) => void;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, onEditLead }) => {
    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 text-yellow-200 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.272-1.21 2.908 0l-1.454 2.788-1.454-2.788zM10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
                </svg>
                Actionable Alerts
            </h3>
            <ul className="space-y-1 list-disc list-inside">
                {alerts.map(({ lead, message }, index) => (
                    <li key={index}>
                        <span className="font-semibold">{lead.name}:</span> {message}
                        <button 
                            onClick={() => onEditLead(lead)}
                            className="ml-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                        >
                            (View/Edit)
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;
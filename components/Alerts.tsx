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
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-400/30 text-yellow-200 rounded-xl shadow-lg animate-fadeIn backdrop-blur-sm">
            <h3 className="font-bold mb-3 flex items-center text-yellow-100 text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.272-1.21 2.908 0l-1.454 2.788-1.454-2.788zM10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
                </svg>
                Actionable Alerts
            </h3>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
                {alerts.map(({ lead, message }, index) => (
                    <div key={index} className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                        <p>
                           <strong className="font-semibold text-yellow-100">{lead.name}:</strong> {message}
                        </p>
                        <button 
                            onClick={() => onEditLead(lead)}
                            className="ml-4 flex-shrink-0 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1 rounded-md text-xs font-semibold transition-colors"
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alerts;
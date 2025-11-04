import React from 'react';
import { Lead } from '../types';
import { STAGE_COLORS } from '../constants';
import clsx from 'clsx';

interface LeadCardProps {
    lead: Lead;
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onDragStart }) => {
    const colors = STAGE_COLORS[lead.stage];
    
    const Icon: React.FC<{ type: Lead['type'] }> = ({ type }) => {
        if (type === 'Center') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-8h1m-1 4h1m-1 4h1" /></svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        );
    };
    
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead.id)}
            className={clsx("bg-gray-800 p-3 rounded-lg shadow-md cursor-grab active:cursor-grabbing border-l-4", colors.border)}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm text-gray-100">{lead.name}</h3>
                <div className="flex space-x-1">
                    <button onClick={() => onEdit(lead)} className="p-1 text-gray-400 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg></button>
                    <button onClick={() => onDelete(lead.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <Icon type={lead.type} /> {lead.type}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500 space-y-1">
                <p>Source: <span className="font-medium text-gray-400">{lead.source}</span></p>
                <p>Added: <span className="font-medium text-gray-400">{new Date(lead.dateAdded).toLocaleDateString()}</span></p>
            </div>
        </div>
    );
};

export default LeadCard;
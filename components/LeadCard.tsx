import React from 'react';
import { Lead } from '../types';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface LeadCardProps {
    lead: Lead;
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
    onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
    isSelected: boolean;
    onSelect: (leadId: string) => void;
    borderColor: string;
    isDraggable?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onDragStart, onDragEnd, isSelected, onSelect, borderColor, isDraggable = true }) => {
    
    const ClientIcon: React.FC<{ type: Lead['type'] }> = ({ type }) => {
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
            draggable={isDraggable}
            onDragStart={isDraggable && onDragStart ? (e) => onDragStart(e, lead.id) : undefined}
            onDragEnd={isDraggable && onDragEnd ? onDragEnd : undefined}
            onClick={() => onSelect(lead.id)}
            title={lead.notes ? `Notes: ${lead.notes}` : ''}
            className={clsx(
                "bg-gray-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border-l-4 transform transition-all duration-300 group",
                isDraggable && 'cursor-grab hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10',
                borderColor,
                { 'ring-2 ring-offset-2 ring-offset-gray-900 ring-cyan-400 shadow-2xl -translate-y-1': isSelected }
            )}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                        onClick={e => e.stopPropagation()} 
                        className="flex-shrink-0"
                    >
                        <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => onSelect(lead.id)}
                            id={`select-${lead.id}`}
                            className="hidden peer"
                        />
                        <label 
                            htmlFor={`select-${lead.id}`}
                            className={clsx(
                                "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center cursor-pointer",
                                isSelected ? 'bg-cyan-500 border-cyan-400' : 'bg-gray-700 border-gray-600 group-hover:border-gray-500'
                            )}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className={clsx("h-3.5 w-3.5 text-white transition-opacity", isSelected ? 'opacity-100' : 'opacity-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </label>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base text-gray-100 truncate">{lead.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                          <ClientIcon type={lead.type} /> {lead.type}
                      </p>
                    </div>
                </div>
                <div className="flex space-x-0.5 flex-shrink-0 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(lead); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-500 space-y-2.5 pl-8">
                <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    Source: <span className="font-medium text-gray-400">{lead.source}</span>
                </p>
                <p className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Added: <span className="font-medium text-gray-400">{formatDistanceToNow(new Date(lead.dateAdded), { addSuffix: true })}</span>
                </p>
                {(lead.stage === 'Delayed' || lead.stage === 'Lost - Refused') && lead.reasonLostDelay && (
                    <p className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-medium text-orange-400">{lead.reasonLostDelay}</span>
                    </p>
                )}
                 {lead.stage === 'Delayed' && lead.recontactDate && (
                    <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.898 2.162l-1.5-1.5a1 1 0 111.415-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.415-1.414l1.5-1.5A5.002 5.002 0 005 9.101V11a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span className="font-medium text-cyan-400">Re-contact: {new Date(lead.recontactDate).toLocaleDateString()}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default LeadCard;
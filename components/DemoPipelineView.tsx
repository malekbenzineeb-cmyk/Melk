import React from 'react';
import clsx from 'clsx';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Lead, DemoStage } from '../types';
import { DEMO_PIPELINE_STAGES, DEMO_STAGE_COLORS } from '../constants';
import LeadCard from './LeadCard';

interface DemoPipelineViewProps {
    leads: Lead[];
    onEditLead: (lead: Lead) => void;
    onDeleteLead: (leadId: string) => void;
    selectedLeadIds: string[];
    onSelectLead: (leadId: string) => void;
}

const getDemoDay = (lead: Lead): DemoStage | null => {
    if (!lead.demoStartDate) return null;
    
    const today = new Date();
    const startDate = parseISO(lead.demoStartDate);
    const dayDiff = differenceInCalendarDays(today, startDate);

    if (dayDiff === 0) return 'Day 1';
    if (dayDiff === 1) return 'Day 2';
    if (dayDiff >= 2) return 'Day 3';
    
    return null; // For demos starting in the future, etc.
};

const DemoPipelineView: React.FC<DemoPipelineViewProps> = ({ leads, onEditLead, onDeleteLead, selectedLeadIds, onSelectLead }) => {
    return (
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-10 px-10">
            {DEMO_PIPELINE_STAGES.map(stage => {
                const stageLeads = leads.filter(lead => getDemoDay(lead) === stage);
                const colors = DEMO_STAGE_COLORS[stage];
                return (
                    <div 
                        key={stage} 
                        className="flex-shrink-0 w-80 bg-gray-900/50 rounded-xl shadow-lg border border-gray-800/80 backdrop-blur-sm"
                    >
                        <div className={clsx("sticky top-0 p-4 rounded-t-xl z-10", "border-b", colors.border)}>
                            <h2 className={clsx("text-sm font-bold uppercase tracking-widest flex justify-between items-center", colors.text)}>
                                {stage}
                                 <span className="text-xs font-bold bg-black/30 text-gray-300 px-2.5 py-1 rounded-full">
                                    {stageLeads.length}
                                </span>
                            </h2>
                        </div>
                        <div className="p-3 space-y-3 h-full overflow-y-auto">
                            {stageLeads.map((lead, index) => (
                                <div key={lead.id} className="animate-stagger" style={{animationDelay: `${index * 60}ms`}}>
                                    <LeadCard
                                        lead={lead}
                                        onEdit={onEditLead}
                                        onDelete={onDeleteLead}
                                        isSelected={selectedLeadIds.includes(lead.id)}
                                        onSelect={onSelectLead}
                                        borderColor={colors.border}
                                        isDraggable={false}
                                    />
                                </div>
                            ))}
                            {stageLeads.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-40 text-center text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-lg m-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p>No demos on this day</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DemoPipelineView;
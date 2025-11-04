import React, { useState } from 'react';
import clsx from 'clsx';
import { Lead, PipelineStage } from '../types';
import { PIPELINE_STAGES, STAGE_COLORS } from '../constants';
import LeadCard from './LeadCard';

interface PipelineViewProps {
    leads: Lead[];
    onEditLead: (lead: Lead) => void;
    onDeleteLead: (leadId: string) => void;
    onUpdateLead: (leadId: string, updatedData: Partial<Lead>) => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ leads, onEditLead, onDeleteLead, onUpdateLead }) => {
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stage: PipelineStage) => {
        e.preventDefault();
        setDragOverStage(stage);
    };
    
    const handleDragLeave = () => {
        setDragOverStage(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: PipelineStage) => {
        e.preventDefault();
        if (draggedLeadId) {
            const lead = leads.find(l => l.id === draggedLeadId);
            if (lead && lead.stage !== stage) {
                onUpdateLead(draggedLeadId, { stage });
            }
        }
        setDraggedLeadId(null);
        setDragOverStage(null);
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {PIPELINE_STAGES.map(stage => {
                const stageLeads = leads.filter(lead => lead.stage === stage);
                const colors = STAGE_COLORS[stage];
                return (
                    <div 
                        key={stage} 
                        className={clsx(
                            "flex-shrink-0 w-80 bg-gray-800/60 rounded-xl shadow-lg transition-all duration-300",
                            { 'bg-gray-700/80 scale-[1.02]': dragOverStage === stage }
                        )}
                        onDragOver={(e) => handleDragOver(e, stage)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, stage)}
                    >
                        <div className={clsx("sticky top-0 p-3 rounded-t-xl z-10", colors.bg)}>
                            <h2 className={clsx("text-sm font-semibold uppercase tracking-wider flex justify-between items-center", colors.text)}>
                                {stage}
                                <span className="text-xs font-bold bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                    {stageLeads.length}
                                </span>
                            </h2>
                        </div>
                        <div className="p-2 space-y-2 h-full">
                            {stageLeads.length > 0 ? stageLeads.map(lead => (
                                <LeadCard
                                    key={lead.id}
                                    lead={lead}
                                    onEdit={onEditLead}
                                    onDelete={onDeleteLead}
                                    onDragStart={handleDragStart}
                                />
                            )) : (
                                <div className="flex items-center justify-center h-32 text-center text-gray-500 text-sm">
                                    <p>Drag leads here</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PipelineView;
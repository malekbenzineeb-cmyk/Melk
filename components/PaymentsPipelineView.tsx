import React, { useState } from 'react';
import clsx from 'clsx';
import { Lead, PaymentStage } from '../types';
import { PAYMENT_PIPELINE_STAGES, PAYMENT_STAGE_COLORS } from '../constants';
import LeadCard from './LeadCard';

interface PaymentsPipelineViewProps {
    leads: Lead[];
    onEditLead: (lead: Lead) => void;
    onDeleteLead: (leadId: string) => void;
    onUpdateLeadPaymentStage: (leadId: string, paymentStage: PaymentStage) => void;
    selectedLeadIds: string[];
    onSelectLead: (leadId: string) => void;
}

const PaymentsPipelineView: React.FC<PaymentsPipelineViewProps> = ({ leads, onEditLead, onDeleteLead, onUpdateLeadPaymentStage, selectedLeadIds, onSelectLead }) => {
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [dragOverStage, setDragOverStage] = useState<PaymentStage | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragged-ghost');
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragged-ghost');
        setDraggedLeadId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stage: PaymentStage) => {
        e.preventDefault();
        setDragOverStage(stage);
    };
    
    const handleDragLeave = () => {
        setDragOverStage(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: PaymentStage) => {
        e.preventDefault();
        if (draggedLeadId) {
            const lead = leads.find(l => l.id === draggedLeadId);
            if (lead && lead.paymentStage !== stage) {
                onUpdateLeadPaymentStage(draggedLeadId, stage);
            }
        }
        setDraggedLeadId(null);
        setDragOverStage(null);
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-10 px-10">
            {PAYMENT_PIPELINE_STAGES.map(stage => {
                const stageLeads = leads.filter(lead => lead.paymentStage === stage);
                const colors = PAYMENT_STAGE_COLORS[stage];
                return (
                    <div 
                        key={stage} 
                        className={clsx(
                            "flex-shrink-0 w-80 bg-gray-900/50 rounded-xl shadow-lg transition-all duration-300 border border-gray-800/80 backdrop-blur-sm",
                            { [`shadow-cyan-500/20 shadow-2xl ${colors.border}`]: dragOverStage === stage }
                        )}
                        onDragOver={(e) => handleDragOver(e, stage)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, stage)}
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
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                        isSelected={selectedLeadIds.includes(lead.id)}
                                        onSelect={onSelectLead}
                                        borderColor={colors.border}
                                        isDraggable={true}
                                    />
                                </div>
                            ))}
                            {stageLeads.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-40 text-center text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-lg m-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                                    <p>Drag clients here</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PaymentsPipelineView;
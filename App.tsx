

import React, { useState, useMemo, useCallback } from 'react';
import { differenceInDays, isBefore, isToday, parseISO } from 'date-fns';
import { Lead, PipelineStage } from './types';
import { useLeads } from './hooks/useLeads';
import Header from './components/Header';
import PipelineView from './components/PipelineView';
import DashboardView from './components/DashboardView';
import PaymentsPipelineView from './components/PaymentsPipelineView';
import DemoPipelineView from './components/DemoPipelineView';
import LeadModal from './components/LeadModal';
import Alerts from './components/Alerts';
import { LEAD_SOURCES, PAYMENT_PIPELINE_STAGES } from './constants';

function App() {
    const { 
        leads, 
        addLead, 
        updateLead, 
        deleteLead, 
        deleteLeads, 
        updateLeadsStage, 
        exportToCSV, 
        updateLeadPaymentStage,
        exportJSON,
        importJSON
    } = useLeads();
    
    const [currentView, setCurrentView] = useState<'pipeline' | 'dashboard' | 'payments' | 'demo'>('pipeline');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ stage: 'All', type: 'All', source: 'All' });
    const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

    const handleAddLeadClick = useCallback(() => {
        setEditingLead(null);
        setIsModalOpen(true);
    }, []);

    const handleEditLead = useCallback((lead: Lead) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingLead(null);
    }, []);

    const handleSaveLead = useCallback((leadData: Omit<Lead, 'id' | 'dateAdded'>) => {
        if (editingLead) {
            updateLead(editingLead.id, leadData);
        } else {
            addLead(leadData);
        }
        handleCloseModal();
    }, [editingLead, addLead, updateLead, handleCloseModal]);
    
    const handleDeleteLead = useCallback((leadId: string) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            deleteLead(leadId);
            setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
        }
    }, [deleteLead]);
    
    const handleSelectLead = useCallback((leadId: string) => {
        setSelectedLeadIds(prev =>
            prev.includes(leadId)
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    }, []);

    const clearSelection = useCallback(() => setSelectedLeadIds([]), []);
    
    const handleBulkDelete = useCallback(() => {
        if (window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} leads?`)) {
            deleteLeads(selectedLeadIds);
            clearSelection();
        }
    }, [selectedLeadIds, deleteLeads, clearSelection]);

    const handleBulkStageChange = useCallback((stage: PipelineStage) => {
        updateLeadsStage(selectedLeadIds, stage);
        clearSelection();
    }, [selectedLeadIds, updateLeadsStage, clearSelection]);

    const handleBulkExport = useCallback(() => {
        const leadsToExport = leads.filter(lead => selectedLeadIds.includes(lead.id));
        exportToCSV(leadsToExport);
    }, [selectedLeadIds, leads, exportToCSV]);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchMatch = searchTerm === '' ||
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

            const stageMatch = filters.stage === 'All' || lead.stage === filters.stage;
            const typeMatch = filters.type === 'All' || lead.type === filters.type;
            const sourceMatch = filters.source === 'All' || lead.source === filters.source;

            return searchMatch && stageMatch && typeMatch && sourceMatch;
        });
    }, [leads, searchTerm, filters]);
    
    const alerts = useMemo(() => {
        const today = new Date();
        const alertsList: { lead: Lead; message: string; type: 'pipeline' | 'demo' | 'payments' }[] = [];

        leads.forEach(lead => {
            // 1. Stale New Leads (>3 days in 'New Lead')
            if (lead.stage === 'New Lead') {
                const dateAdded = parseISO(lead.dateAdded);
                if (differenceInDays(today, dateAdded) > 3) {
                    alertsList.push({ 
                        lead, 
                        message: `Stuck in "New Lead" for ${differenceInDays(today, dateAdded)} days. Action needed.`,
                        type: 'pipeline' 
                    });
                }
            }
    
            // 2. Delayed Re-contact
            if (lead.stage === 'Delayed' && lead.recontactDate) {
                const recontactDate = parseISO(lead.recontactDate);
                if (isToday(recontactDate)) {
                    alertsList.push({ lead, message: 'Re-contact today.', type: 'pipeline' });
                } else if (isBefore(recontactDate, today)) {
                    alertsList.push({ lead, message: `Re-contact was due on ${recontactDate.toLocaleDateString()}.`, type: 'pipeline' });
                }
            }
    
            // 3. Demo Ending/Ended
            if (lead.stage === 'Demo Active' && lead.demoEndDate) {
                const demoEndDate = parseISO(lead.demoEndDate);
                const daysLeft = differenceInDays(demoEndDate, today);
                if (daysLeft === 0) {
                    alertsList.push({ lead, message: 'Demo ends today. Follow up required.', type: 'demo' });
                } else if (daysLeft < 0) {
                    alertsList.push({ lead, message: `Demo ended ${Math.abs(daysLeft)} days ago. Follow up.`, type: 'demo' });
                }
            }
            
            // 4. Payment Follow-up (after 30 days)
            if (lead.stage === 'Closed - Paid' && lead.paymentStage && lead.paymentStage !== 'Done' && Array.isArray(lead.installments)) {
                const currentStageIndex = PAYMENT_PIPELINE_STAGES.indexOf(lead.paymentStage);
                
                // A reminder is for the CURRENT stage, based on the date of the PREVIOUS stage's payment.
                // Therefore, this logic is only relevant for stages from 'Second Installment' onwards.
                if (currentStageIndex > 0) {
                    const previousInstallment = lead.installments[currentStageIndex - 1];
            
                    // Ensure the previous installment exists and has a valid date.
                    if (previousInstallment && previousInstallment.date) {
                        try {
                            const lastPaymentDate = parseISO(previousInstallment.date);
                            const daysSince = differenceInDays(today, lastPaymentDate);
            
                            if (daysSince >= 30) {
                                alertsList.push({
                                    lead,
                                    message: `Follow up for ${lead.paymentStage} payment. It's been ${daysSince} days since the last.`,
                                    type: 'payments'
                                });
                            }
                        } catch (e) {
                            // Silently ignore if date is invalid to prevent app crash
                            console.warn(`Invalid date format for installment on lead ${lead.id}`);
                        }
                    }
                }
            }
        });
    
        return alertsList;
    }, [leads]);
    
    const viewSpecificAlerts = useMemo(() => {
        if (currentView === 'dashboard') {
            return alerts; // Dashboard shows all alerts
        }
        return alerts.filter(alert => alert.type === currentView);
    }, [alerts, currentView]);
    
    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView leads={leads} />;
            case 'payments':
                return <PaymentsPipelineView 
                    leads={filteredLeads.filter(l => l.stage === 'Closed - Paid')} 
                    onEditLead={handleEditLead} 
                    onDeleteLead={handleDeleteLead}
                    onUpdateLeadPaymentStage={updateLeadPaymentStage}
                    selectedLeadIds={selectedLeadIds}
                    onSelectLead={handleSelectLead}
                />;
            case 'demo':
// Fix: Corrected typo from `filteredLele.tsxads` to `filteredLeads`.
                return <DemoPipelineView 
                    leads={filteredLeads.filter(l => l.stage === 'Demo Active')} 
                    onEditLead={handleEditLead} 
                    onDeleteLead={handleDeleteLead}
                    selectedLeadIds={selectedLeadIds}
                    onSelectLead={handleSelectLead}
                />;
            case 'pipeline':
            default:
                return <PipelineView 
                    leads={filteredLeads} 
                    onEditLead={handleEditLead} 
                    onDeleteLead={handleDeleteLead}
                    onUpdateLead={updateLead}
                    selectedLeadIds={selectedLeadIds}
                    onSelectLead={handleSelectLead}
                />;
        }
    };
    
    const allSources = useMemo(() => ['All', ...LEAD_SOURCES], []);

    return (
        <div className="bg-gray-950 text-gray-200 min-h-screen flex flex-col font-sans">
            <Header
                currentView={currentView}
                onViewChange={setCurrentView}
                onAddLead={handleAddLeadClick}
                onExportCSV={() => exportToCSV()}
                onExportJSON={exportJSON}
                onImportJSON={importJSON}
                alertCount={alerts.length}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                filters={filters}
                onFiltersChange={setFilters}
                sources={allSources}
                selectedCount={selectedLeadIds.length}
                onClearSelection={clearSelection}
                onBulkDelete={handleBulkDelete}
                onBulkStageChange={handleBulkStageChange}
                onBulkExport={handleBulkExport}
            />
            <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                <Alerts alerts={viewSpecificAlerts} onEditLead={handleEditLead} />
                {renderView()}
            </main>
            {isModalOpen && <LeadModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                onSave={handleSaveLead}
                lead={editingLead}
            />}
        </div>
    );
}

export default App;
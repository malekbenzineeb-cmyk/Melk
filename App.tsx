import React, { useState, useMemo } from 'react';
import { useLeads } from './hooks/useLeads';
import Header from './components/Header';
import PipelineView from './components/PipelineView';
import DashboardView from './components/DashboardView';
import LeadModal from './components/LeadModal';
import Alerts from './components/Alerts';
import { Lead } from './types';

type View = 'pipeline' | 'dashboard';

function App() {
    const { leads, addLead, updateLead, deleteLead, exportToCSV } = useLeads();
    const [view, setView] = useState<View>('pipeline');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddLead = () => {
        setSelectedLead(null);
        setIsModalOpen(true);
    };

    const handleEditLead = (lead: Lead) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
    };

    const handleSaveLead = (leadData: Omit<Lead, 'id' | 'dateAdded'> & { id?: string }) => {
        if (selectedLead) {
            updateLead(selectedLead.id, leadData);
        } else {
            addLead(leadData);
        }
        setIsModalOpen(false);
        setSelectedLead(null);
    };

    const handleDeleteLead = (leadId: string) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            deleteLead(leadId);
        }
    };

    const alerts = useMemo(() => {
        const today = new Date();
        const upcomingAlerts: { lead: Lead; message: string }[] = [];
        leads.forEach(lead => {
            // Demo end reminder (3 days)
            if (lead.stage === 'Demo Active' && lead.demoEndDate) {
                const endDate = new Date(lead.demoEndDate);
                const diffTime = endDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays <= 3) {
                    upcomingAlerts.push({ lead, message: `Demo ends in ${diffDays} day(s).` });
                }
            }
            // Follow-up for "Delayed" leads after 7 days
            if (lead.stage === 'Delayed' && lead.recontactDate) {
                 const recontactDate = new Date(lead.recontactDate);
                 if(recontactDate <= today) {
                     upcomingAlerts.push({ lead, message: `Scheduled follow-up is today or overdue.` });
                 }
            }
        });
        return upcomingAlerts;
    }, [leads]);
    
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
            <Header
                currentView={view}
                onViewChange={setView}
                onAddLead={handleAddLead}
                onExport={exportToCSV}
                alertCount={alerts.length}
            />
            <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto">
                <Alerts alerts={alerts} onEditLead={handleEditLead}/>
                {view === 'pipeline' ? (
                    <PipelineView
                        leads={leads}
                        onEditLead={handleEditLead}
                        onDeleteLead={handleDeleteLead}
                        onUpdateLead={updateLead}
                    />
                ) : (
                    <DashboardView leads={leads} />
                )}
            </main>
            <LeadModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedLead(null);
                }}
                onSave={handleSaveLead}
                lead={selectedLead}
            />
        </div>
    );
}

export default App;
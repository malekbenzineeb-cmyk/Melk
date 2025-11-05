import { useState, useEffect, useCallback, useRef } from 'react';
import { Lead, PipelineStage, PaymentStage } from '../types';

const LOCAL_STORAGE_KEY = 'cyber-ocean-leads-v2';
const BACKUP_STORAGE_KEY = 'cyber-ocean-leads-backups-v1';
const MAX_BACKUPS = 10;

const getInitialLeads = (): Lead[] => {
    try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        // Add some dummy data for demonstration if storage is empty
        if (!item) {
             const dummyLeads: Lead[] = [
                { id: 'lead-1', name: 'Alex Johnson', contact: '+14155550101', email: 'alex.j@example.com', type: 'Private Teacher', stage: 'New Lead', dateAdded: new Date(Date.now() - 10 * 86400000).toISOString(), source: 'Ad Campaign' },
                { id: 'lead-2', name: 'Innovate Learning Center', contact: '+14155550102', email: 'contact@innovate.edu', type: 'Center', stage: 'Contacted', dateAdded: new Date(Date.now() - 8 * 86400000).toISOString(), source: 'Referral', notes: 'Initial call went well, they are interested in a demo next week.' },
                { id: 'lead-3', name: 'Samantha Bee', contact: '+21698123456', email: 's.bee@example.com', type: 'Private Teacher', stage: 'Demo Active', dateAdded: new Date(Date.now() - 5 * 86400000).toISOString(), source: 'Ad Campaign', demoStartDate: new Date(Date.now() - 2 * 86400000).toISOString(), demoEndDate: new Date(Date.now() + 1 * 86400000).toISOString() },
                { 
                    id: 'lead-4', 
                    name: 'Future Minds Academy', 
                    contact: '+21655123456', 
                    email: 'billing@futureminds.com', 
                    type: 'Center', 
                    stage: 'Closed - Paid', 
                    dateAdded: new Date(Date.now() - 60 * 86400000).toISOString(), 
                    source: 'Website', 
                    paymentDate: new Date(Date.now() - 50 * 86400000).toISOString(), 
                    paymentStage: 'Second Installment',
                    ribType: 'Cyber Ocean RIB',
                    numberOfInstallments: 4,
                    installments: [
                        { date: new Date(Date.now() - 50 * 86400000).toISOString().split('T')[0], documentName: 'installment1.pdf' },
                        { date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0], documentName: 'installment2.pdf' },
                        { date: '', documentName: '' },
                        { date: '', documentName: '' },
                    ],
                    numberOfInvoices: 2,
                    invoices: [
                        { documentName: 'invoice1.pdf' },
                        { documentName: 'invoice2.pdf' },
                    ]
                },
                { id: 'lead-5', name: 'Michael Chen', contact: '+16505550105', email: 'mchen.teacher@example.com', type: 'Private Teacher', stage: 'Delayed', dateAdded: new Date(Date.now() - 15 * 86400000).toISOString(), source: 'Ad Campaign', reasonLostDelay: 'Timing', recontactDate: new Date(Date.now() - 2 * 86400000).toISOString() },
                { id: 'lead-6', name: 'Bright Sparks Hub', contact: '+442079460106', email: 'info@brightsparks.org', type: 'Center', stage: 'Lost - Refused', dateAdded: new Date(Date.now() - 12 * 86400000).toISOString(), source: 'Cold Call', reasonLostDelay: 'Price' },
             ];
             return dummyLeads;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return [];
    }
};

export function useLeads() {
    const [leads, setLeads] = useState<Lead[]>(getInitialLeads);
    const backupTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
        } catch (error) {
// Fix: Added curly braces to the catch block to fix syntax error.
            console.error("Error writing to localStorage", error);
        }
    }, [leads]);

    useEffect(() => {
        // Debounced auto-backup
        if (backupTimeoutRef.current) {
            clearTimeout(backupTimeoutRef.current);
        }
        backupTimeoutRef.current = window.setTimeout(() => {
            try {
                const backupsRaw = window.localStorage.getItem(BACKUP_STORAGE_KEY);
                const backups = backupsRaw ? JSON.parse(backupsRaw) : [];

                const newBackup = {
                    timestamp: new Date().toISOString(),
                    leadCount: leads.length,
                    data: leads
                };
                const updatedBackups = [newBackup, ...backups];

                if (updatedBackups.length > MAX_BACKUPS) {
                    updatedBackups.splice(MAX_BACKUPS);
                }

                window.localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updatedBackups));
            } catch (error) {
                console.error("Error creating automatic backup", error);
            }
        }, 2000);

        return () => {
            if (backupTimeoutRef.current) {
                clearTimeout(backupTimeoutRef.current);
            }
        };
    }, [leads]);

    const addLead = useCallback((newLeadData: Omit<Lead, 'id' | 'dateAdded'>) => {
        const newLead: Lead = {
            ...newLeadData,
            id: `lead-${new Date().getTime()}-${Math.random()}`,
            dateAdded: new Date().toISOString(),
        };
        setLeads(prevLeads => [...prevLeads, newLead]);
    }, []);

    const updateLead = useCallback((leadId: string, updatedData: Partial<Omit<Lead, 'id'>>) => {
        setLeads(prevLeads =>
            prevLeads.map(lead => {
                if (lead.id === leadId) {
                    const wasDemoActive = lead.stage === 'Demo Active';
                    const newLeadData = { ...lead, ...updatedData };
                    const isNowDemoActive = newLeadData.stage === 'Demo Active';

                    // If it just became Demo Active
                    if (isNowDemoActive && !wasDemoActive) {
                        newLeadData.demoStartDate = new Date().toISOString();
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 3);
                        newLeadData.demoEndDate = endDate.toISOString();
                    }

                    if (newLeadData.stage === 'Closed - Paid' && !newLeadData.paymentStage) {
                        newLeadData.paymentStage = 'Upfront Installment';
                    }
                    return newLeadData;
                }
                return lead;
            })
        );
    }, []);

    const deleteLead = useCallback((leadId: string) => {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    }, []);

    const deleteLeads = useCallback((leadIds: string[]) => {
        setLeads(prevLeads => prevLeads.filter(lead => !leadIds.includes(lead.id)));
    }, []);

    const updateLeadsStage = useCallback((leadIds: string[], stage: PipelineStage) => {
        setLeads(prevLeads =>
            prevLeads.map(lead => {
                if (leadIds.includes(lead.id)) {
                    const wasDemoActive = lead.stage === 'Demo Active';
                    const isNowDemoActive = stage === 'Demo Active';
                    
                    const newLeadData = { ...lead, stage };

                    if (isNowDemoActive && !wasDemoActive) {
                        newLeadData.demoStartDate = new Date().toISOString();
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 3);
                        newLeadData.demoEndDate = endDate.toISOString();
                    }

                    if (newLeadData.stage === 'Closed - Paid' && !newLeadData.paymentStage) {
                        newLeadData.paymentStage = 'Upfront Installment';
                    }
                    return newLeadData;
                }
                return lead;
            })
        );
    }, []);
    
    const updateLeadPaymentStage = useCallback((leadId: string, paymentStage: PaymentStage) => {
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead.id === leadId ? { ...lead, paymentStage } : lead
            )
        );
    }, []);

    const exportToCSV = useCallback((leadsToExport?: Lead[]) => {
        const dataToExport = leadsToExport || leads;
        if (dataToExport.length === 0) {
            alert("No leads to export.");
            return;
        }

        const headers: (keyof Lead)[] = ['id', 'name', 'contact', 'email', 'type', 'stage', 'paymentStage', 'dateAdded', 'demoStartDate', 'demoEndDate', 'paymentDate', 'notes', 'source', 'reasonLostDelay', 'recontactDate', 'ribType', 'numberOfInstallments', 'installments', 'numberOfInvoices', 'invoices'];
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(lead =>
                headers.map(header => {
                    const value = lead[header];
                    if (typeof value === 'object' && value !== null) {
                         return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    const stringValue = value ? String(value).replace(/"/g, '""') : '';
                    return `"${stringValue}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'cyber-ocean-leads.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [leads]);

    const exportJSON = useCallback(() => {
        if (leads.length === 0) {
            alert("No data to export.");
            return;
        }
        const jsonContent = JSON.stringify(leads, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `cyber-ocean-backup-${date}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [leads]);

    const importJSON = useCallback((jsonContent: string) => {
        try {
            const importedLeads = JSON.parse(jsonContent);
            if (!Array.isArray(importedLeads)) {
                throw new Error("Invalid format: Backup file should contain an array.");
            }
            if (importedLeads.length > 0 && (!importedLeads[0].id || !importedLeads[0].name)) {
                 throw new Error("Invalid format: Leads in backup file are missing required properties.");
            }
            
            setLeads(importedLeads);
            alert(`Successfully imported ${importedLeads.length} leads.`);
        } catch (error) {
            console.error("Error importing from JSON", error);
            alert(`Failed to import backup: ${error instanceof Error ? error.message : String(error)}`);
        }
    }, []);

    return { leads, addLead, updateLead, deleteLead, deleteLeads, updateLeadsStage, exportToCSV, updateLeadPaymentStage, exportJSON, importJSON };
}
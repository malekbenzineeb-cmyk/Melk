import { useState, useEffect, useCallback } from 'react';
import { Lead } from '../types';

const LOCAL_STORAGE_KEY = 'cyber-ocean-leads-v2';

const getInitialLeads = (): Lead[] => {
    try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        // Add some dummy data for demonstration if storage is empty
        if (!item) {
             const dummyLeads: Lead[] = [
                { id: 'lead-1', name: 'Alex Johnson', contact: '555-0101', type: 'Private Teacher', stage: 'New Lead', dateAdded: new Date(Date.now() - 10 * 86400000).toISOString(), source: 'Ad Campaign A' },
                { id: 'lead-2', name: 'Innovate Learning Center', contact: '555-0102', type: 'Center', stage: 'Contacted', dateAdded: new Date(Date.now() - 8 * 86400000).toISOString(), source: 'Referral' },
                { id: 'lead-3', name: 'Samantha Bee', contact: '555-0103', type: 'Private Teacher', stage: 'Demo Active', dateAdded: new Date(Date.now() - 5 * 86400000).toISOString(), source: 'Ad Campaign B', demoStartDate: new Date(Date.now() - 2 * 86400000).toISOString(), demoEndDate: new Date(Date.now() + 2 * 86400000).toISOString() },
                { id: 'lead-4', name: 'Future Minds Academy', contact: '555-0104', type: 'Center', stage: 'Closed - Paid', dateAdded: new Date(Date.now() - 30 * 86400000).toISOString(), source: 'Website', paymentDate: new Date(Date.now() - 20 * 86400000).toISOString() },
                { id: 'lead-5', name: 'Michael Chen', contact: '555-0105', type: 'Private Teacher', stage: 'Delayed', dateAdded: new Date(Date.now() - 15 * 86400000).toISOString(), source: 'Ad Campaign A', reasonLostDelay: 'Timing', recontactDate: new Date(Date.now() - 2 * 86400000).toISOString() },
                { id: 'lead-6', name: 'Bright Sparks Hub', contact: '555-0106', type: 'Center', stage: 'Lost - Refused', dateAdded: new Date(Date.now() - 12 * 86400000).toISOString(), source: 'Cold Call', reasonLostDelay: 'Price' },
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

    useEffect(() => {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
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
            prevLeads.map(lead =>
                lead.id === leadId ? { ...lead, ...updatedData } : lead
            )
        );
    }, []);

    const deleteLead = useCallback((leadId: string) => {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    }, []);

    const exportToCSV = useCallback(() => {
        if (leads.length === 0) {
            alert("No leads to export.");
            return;
        }

        const headers: (keyof Lead)[] = ['id', 'name', 'contact', 'type', 'stage', 'dateAdded', 'demoStartDate', 'demoEndDate', 'paymentDate', 'notes', 'source', 'reasonLostDelay', 'recontactDate'];
        const csvContent = [
            headers.join(','),
            ...leads.map(lead =>
                headers.map(header => {
                    const value = lead[header] || '';
                    const stringValue = typeof value === 'string' ? value.replace(/"/g, '""') : String(value);
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

    return { leads, addLead, updateLead, deleteLead, exportToCSV };
}
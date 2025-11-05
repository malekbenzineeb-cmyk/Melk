// Fix: Removed self-import that caused declaration conflicts as the types are defined within this file.
export type PipelineStage = 'New Lead' | 'Contacted' | 'Demo Active' | 'Closed - Paid' | 'Delayed' | 'Lost - Refused';

export type PaymentStage = 'Upfront Installment' | 'Second Installment' | 'Third Installment' | 'Fourth Installment' | 'Done';

export type DemoStage = 'Day 1' | 'Day 2' | 'Day 3';

export type ClientType = 'Private Teacher' | 'Center';

export type ReasonLostOrDelay = 'Price' | 'Timing' | 'Competition' | 'No Response' | 'Other';

export type RIBType = 'Private RIB' | 'Cyber Ocean RIB';

export interface Installment {
    date: string; // YYYY-MM-DD
    documentName?: string;
    documentContent?: string; // Base64 Data URL
    documentMimeType?: string;
}

export interface Invoice {
    documentName?: string;
    documentContent?: string; // Base64 Data URL
    documentMimeType?: string;
}

export interface Lead {
    id: string;
    name: string;
    contact: string; // Phone / WhatsApp
    email?: string;
    type: ClientType;
    stage: PipelineStage;
    paymentStage?: PaymentStage;
    dateAdded: string; // ISO string
    demoStartDate?: string; // ISO string
    demoEndDate?: string; // ISO string
    paymentDate?: string; // ISO string
    notes?: string;
    source: string; // Ad Version or Campaign
    reasonLostDelay?: ReasonLostOrDelay;
    recontactDate?: string; // ISO string
    // Payment tracking fields
    ribType?: RIBType;
    numberOfInstallments?: number;
    installments?: Installment[];
    numberOfInvoices?: number;
    invoices?: Invoice[];
}
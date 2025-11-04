export type PipelineStage = 'New Lead' | 'Contacted' | 'Demo Active' | 'Closed - Paid' | 'Delayed' | 'Lost - Refused';

export type ClientType = 'Private Teacher' | 'Center';

export type ReasonLostOrDelay = 'Price' | 'Timing' | 'Competition' | 'No Response' | 'Other';

export interface Lead {
    id: string;
    name: string;
    contact: string; // Phone / WhatsApp
    type: ClientType;
    stage: PipelineStage;
    dateAdded: string; // ISO string
    demoStartDate?: string; // ISO string
    demoEndDate?: string; // ISO string
    paymentDate?: string; // ISO string
    notes?: string;
    source: string; // Ad Version or Campaign
    reasonLostDelay?: ReasonLostOrDelay;
    recontactDate?: string; // ISO string
}
import { PipelineStage, ReasonLostOrDelay, PaymentStage, DemoStage } from './types';

export const PIPELINE_STAGES: PipelineStage[] = [
    'New Lead',
    'Contacted',
    'Demo Active',
    'Closed - Paid',
    'Delayed',
    'Lost - Refused'
];

export const LEAD_SOURCES: string[] = [
    'Social Media',
    'Referral',
    'Website',
    'Ad Campaign',
    'Cold Call',
    'Other'
];

export const REASONS_LOST_DELAY: ReasonLostOrDelay[] = [
    'Price',
    'Timing',
    'Competition',
    'No Response',
    'Other'
];

export const STAGE_COLORS: Record<PipelineStage, { bg: string, border: string, text: string }> = {
    'New Lead': { bg: 'bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-300' },
    'Contacted': { bg: 'bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-300' },
    'Demo Active': { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-300' },
    'Closed - Paid': { bg: 'bg-green-900/20', border: 'border-green-500', text: 'text-green-300' },
    'Delayed': { bg: 'bg-orange-900/20', border: 'border-orange-500', text: 'text-orange-300' },
    'Lost - Refused': { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-300' },
};

export const PAYMENT_PIPELINE_STAGES: PaymentStage[] = [
    'Upfront Installment',
    'Second Installment',
    'Third Installment',
    'Fourth Installment',
    'Done'
];

export const PAYMENT_STAGE_COLORS: Record<PaymentStage, { bg: string, border: string, text: string }> = {
    'Upfront Installment': { bg: 'bg-teal-900/20', border: 'border-teal-500', text: 'text-teal-300' },
    'Second Installment': { bg: 'bg-cyan-900/20', border: 'border-cyan-500', text: 'text-cyan-300' },
    'Third Installment': { bg: 'bg-sky-900/20', border: 'border-sky-500', text: 'text-sky-300' },
    'Fourth Installment': { bg: 'bg-indigo-900/20', border: 'border-indigo-500', text: 'text-indigo-300' },
    'Done': { bg: 'bg-emerald-900/20', border: 'border-emerald-500', text: 'text-emerald-300' },
};

export const DEMO_PIPELINE_STAGES: DemoStage[] = [
    'Day 1',
    'Day 2',
    'Day 3'
];

export const DEMO_STAGE_COLORS: Record<DemoStage, { bg: string, border: string, text: string }> = {
    'Day 1': { bg: 'bg-violet-900/20', border: 'border-violet-500', text: 'text-violet-300' },
    'Day 2': { bg: 'bg-fuchsia-900/20', border: 'border-fuchsia-500', text: 'text-fuchsia-300' },
    'Day 3': { bg: 'bg-pink-900/20', border: 'border-pink-500', text: 'text-pink-300' },
};
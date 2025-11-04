import { PipelineStage, ReasonLostOrDelay } from './types';

export const PIPELINE_STAGES: PipelineStage[] = [
    'New Lead',
    'Contacted',
    'Demo Active',
    'Closed - Paid',
    'Delayed',
    'Lost - Refused'
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
import React from 'react';
import { Lead } from '../types';
import KpiCard from './charts/KpiCard';
import ConversionRateChart from './charts/ConversionRateChart';
import LeadSourcePieChart from './charts/LeadSourcePieChart';
import ReasonFrequencyChart from './charts/ReasonFrequencyChart';
import LeadTimelineChart from './charts/LeadTimelineChart';

interface DashboardViewProps {
    leads: Lead[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ leads }) => {
    const totalLeads = leads.length;
    const paidLeads = leads.filter(lead => lead.stage === 'Closed - Paid');
    const conversionRate = totalLeads > 0 ? (paidLeads.length / totalLeads) * 100 : 0;

    const demoToPaidLeads = leads.filter(l => l.stage === 'Closed - Paid' && l.demoStartDate && l.paymentDate);
    const avgTimeToClose = demoToPaidLeads.length > 0
        ? demoToPaidLeads.reduce((sum, lead) => {
            const start = new Date(lead.demoStartDate!).getTime();
            const end = new Date(lead.paymentDate!).getTime();
            const diffDays = (end - start) / (1000 * 3600 * 24);
            return sum + diffDays;
        }, 0) / demoToPaidLeads.length
        : 0;

    const leadValue = 500; // Assuming a fixed value per lead for demonstration
    const totalRevenue = paidLeads.length * leadValue;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Leads" value={totalLeads.toString()} />
                <KpiCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
                <KpiCard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} />
                <KpiCard title="Avg. Time to Close" value={`${avgTimeToClose.toFixed(1)} days`} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg">
                    <ConversionRateChart leads={leads} />
                </div>
                <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg">
                    <LeadSourcePieChart leads={leads} />
                </div>
                <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg">
                    <ReasonFrequencyChart leads={leads} />
                </div>
                <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg">
                    <LeadTimelineChart leads={leads} />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
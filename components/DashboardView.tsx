import React, { useMemo, useState } from 'react';
import { Lead } from '../types';
import { getMonth, getYear, parseISO } from 'date-fns';
import { PAYMENT_PIPELINE_STAGES } from '../constants';
import KpiCard from './charts/KpiCard';
import ConversionRateChart from './charts/ConversionRateChart';
import LeadSourcePieChart from './charts/LeadSourcePieChart';
import ReasonFrequencyChart from './charts/ReasonFrequencyChart';
import LeadTimelineChart from './charts/LeadTimelineChart';

interface DashboardViewProps {
    leads: Lead[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ leads }) => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

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

    const LEAD_VALUE = 2000; // Total value in TND

    const getPaidInstallmentsCount = (lead: Lead): number => {
        if (!lead.paymentStage) return 0;
        if (lead.paymentStage === 'Done') return lead.numberOfInstallments || 1;
        const stageIndex = PAYMENT_PIPELINE_STAGES.indexOf(lead.paymentStage);
        return stageIndex !== -1 ? stageIndex + 1 : 0;
    };
    
    const totalRevenue = paidLeads.reduce((sum, lead) => {
        const numInstallments = lead.numberOfInstallments || 1;
        const installmentValue = LEAD_VALUE / numInstallments;
        const paidCount = getPaidInstallmentsCount(lead);
        return sum + (installmentValue * paidCount);
    }, 0);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        paidLeads.forEach(lead => {
            if (lead.paymentDate) {
                years.add(getYear(parseISO(lead.paymentDate)));
            }
            lead.installments?.forEach(inst => {
                if (inst.date) {
                    years.add(getYear(parseISO(inst.date)));
                }
            });
        });
        if (years.size === 0) {
            return [new Date().getFullYear()];
        }
        return Array.from(years).sort((a, b) => b - a);
    }, [paidLeads]);
    
    const months = useMemo(() => [
        { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
        { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
        { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
        { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' },
    ], []);

    const calculateRevenueByPeriod = (periodCheck: (date: Date) => boolean): number => {
        return paidLeads.reduce((sum, lead) => {
            const numInstallments = lead.numberOfInstallments;
            
            if (numInstallments && numInstallments > 1 && lead.installments) {
                // Case 1: Installments
                const installmentValue = LEAD_VALUE / numInstallments;
                const paidCount = getPaidInstallmentsCount(lead);
                
                const periodRevenue = lead.installments
                    .slice(0, paidCount) // Only consider paid installments
                    .filter(inst => inst.date && periodCheck(parseISO(inst.date)))
                    .reduce(instSum => instSum + installmentValue, 0);

                return sum + periodRevenue;
            } else {
                // Case 2: Upfront payment
                if (lead.paymentDate && periodCheck(parseISO(lead.paymentDate))) {
                    return sum + LEAD_VALUE;
                }
            }
            return sum;
        }, 0);
    };

    const monthlyRevenue = useMemo(() => {
        return calculateRevenueByPeriod(date =>
            getYear(date) === selectedYear && (getMonth(date) + 1) === selectedMonth
        );
    }, [paidLeads, selectedYear, selectedMonth]);

    const yearlyRevenue = useMemo(() => {
        return calculateRevenueByPeriod(date =>
            getYear(date) === selectedYear
        );
    }, [paidLeads, selectedYear]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="animate-stagger" style={{animationDelay: '100ms'}}><KpiCard title="Total Leads" value={totalLeads.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} /></div>
                <div className="animate-stagger" style={{animationDelay: '200ms'}}><KpiCard title="Total Revenue (Overall)" value={`TND ${totalRevenue.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} /></div>
                <div className="animate-stagger" style={{animationDelay: '300ms'}}><KpiCard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}/></div>
                <div className="animate-stagger" style={{animationDelay: '400ms'}}><KpiCard title="Avg. Time to Close" value={`${avgTimeToClose.toFixed(1)} days`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}/></div>
            </div>

            <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-800/80 backdrop-blur-sm animate-stagger" style={{animationDelay: '500ms'}}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h3 className="text-xl font-semibold text-white">Revenue Analytics</h3>
                    <div className="flex items-center gap-4">
                        <div>
                            <label htmlFor="year-select" className="block text-xs font-medium text-gray-400 mb-1">Year</label>
                            <select
                                id="year-select"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="bg-gray-700/80 border border-gray-600/50 rounded-lg pl-3 pr-8 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                            >
                                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="month-select" className="block text-xs font-medium text-gray-400 mb-1">Month</label>
                            <select
                                id="month-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="bg-gray-700/80 border border-gray-600/50 rounded-lg pl-3 pr-8 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                            >
                                {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <KpiCard title={`Revenue (${months[selectedMonth-1].name})`} value={`TND ${monthlyRevenue.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M30 15 18 3m0 0-6 6m6-6v12" /><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}/>
                    <KpiCard title={`Revenue (${selectedYear})`} value={`TND ${yearlyRevenue.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1 0 0-13.5h9a9.75 9.75 0 1 0 0 13.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 12h.01" /></svg>}/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-800/80 backdrop-blur-sm animate-stagger" style={{animationDelay: '600ms'}}>
                    <ConversionRateChart leads={leads} />
                </div>
                <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-800/80 backdrop-blur-sm animate-stagger" style={{animationDelay: '700ms'}}>
                    <LeadSourcePieChart leads={leads} />
                </div>
                <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-800/80 backdrop-blur-sm animate-stagger" style={{animationDelay: '800ms'}}>
                    <ReasonFrequencyChart leads={leads} />
                </div>
                <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-800/80 backdrop-blur-sm animate-stagger" style={{animationDelay: '900ms'}}>
                    <LeadTimelineChart leads={leads} />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
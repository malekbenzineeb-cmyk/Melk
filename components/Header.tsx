
import React, { useRef } from 'react';
import clsx from 'clsx';
import { PipelineStage } from '../types';
import { PIPELINE_STAGES } from '../constants';

interface HeaderProps {
    currentView: 'pipeline' | 'dashboard' | 'payments' | 'demo';
    onViewChange: (view: 'pipeline' | 'dashboard' | 'payments' | 'demo') => void;
    onAddLead: () => void;
    onExportCSV: () => void;
    onExportJSON: () => void;
    onImportJSON: (jsonContent: string) => void;
    alertCount: number;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    filters: { stage: string; type: string; source: string };
    onFiltersChange: (filters: { stage: string; type: string; source: string }) => void;
    sources: string[];
    selectedCount: number;
    onClearSelection: () => void;
    onBulkDelete: () => void;
    onBulkStageChange: (stage: PipelineStage) => void;
    onBulkExport: () => void;
}

// Fix: Changed JSX.Element to React.ReactNode to resolve namespace issue.
const views: { id: 'pipeline' | 'demo' | 'payments' | 'dashboard'; label: string; icon: React.ReactNode }[] = [
    { id: 'pipeline', label: 'Pipeline', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { id: 'demo', label: 'Demo', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { id: 'payments', label: 'Payments', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
];

// Fix: Added `alertCount` to props destructuring to make it available in the component.
const Header: React.FC<HeaderProps> = ({
    currentView, onViewChange, onAddLead, alertCount, onExportJSON, onImportJSON,
    searchTerm, onSearchTermChange, filters, onFiltersChange, sources,
    selectedCount, onClearSelection, onBulkDelete, onBulkStageChange, onBulkExport
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFilterChange = (filterName: 'stage' | 'type' | 'source', value: string) => {
        onFiltersChange({ ...filters, [filterName]: value });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (window.confirm('Are you sure you want to import this file? This will overwrite all existing data.')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    onImportJSON(text);
                } else {
                    alert('Could not read file.');
                }
            };
            reader.onerror = () => alert('Error reading file.');
            reader.readAsText(file);
        }
        event.target.value = ''; // Reset file input
    };

    const navPillIndex = views.findIndex(v => v.id === currentView);

    const BulkActionBar = () => (
        <div className="flex items-center justify-between w-full h-full animate-fadeIn">
            <div className="flex items-center gap-4">
                <button onClick={onClearSelection} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <span className="font-semibold text-white">{selectedCount} selected</span>
            </div>
            <div className="flex items-center space-x-2">
                 {currentView === 'pipeline' && (
                    <select 
                        onChange={(e) => { if (e.target.value) onBulkStageChange(e.target.value as PipelineStage)}}
                        className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    >
                        <option value="">Change Stage...</option>
                        {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 )}
                <button onClick={onBulkExport} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700/80 transition-colors flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Export CSV</button>
                <button onClick={onBulkDelete} className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600/80 hover:bg-red-600 transition-colors flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>Delete</button>
            </div>
        </div>
    );
    
    const DefaultHeader = () => (
        <>
            <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-white hidden md:block">CyberOcean CRM</h1>
                </div>
                 <div className="relative ml-6 md:ml-10 flex-1 max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input value={searchTerm} onChange={(e) => onSearchTermChange(e.target.value)} type="search" placeholder="Search leads..." className="w-full bg-gray-800/70 border border-gray-700/80 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder-gray-500" />
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4 ml-4">
                <div className="hidden lg:flex items-center space-x-2">
                    {currentView !== 'payments' && currentView !== 'demo' && (
                        <select value={filters.stage} onChange={(e) => handleFilterChange('stage', e.target.value)} className="bg-gray-800/70 border-none rounded-lg pl-3 pr-8 py-2 text-xs text-gray-300 focus:ring-1 focus:ring-cyan-500">
                            <option value="All">All Stages</option>
                            {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    )}
                    <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="bg-gray-800/70 border-none rounded-lg pl-3 pr-8 py-2 text-xs text-gray-300 focus:ring-1 focus:ring-cyan-500">
                        <option value="All">All Types</option>
                        <option value="Private Teacher">Private Teacher</option>
                        <option value="Center">Center</option>
                    </select>
                    <select value={filters.source} onChange={(e) => handleFilterChange('source', e.target.value)} className="bg-gray-800/70 border-none rounded-lg pl-3 pr-8 py-2 text-xs text-gray-300 focus:ring-1 focus:ring-cyan-500">
                        {sources.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
                    </select>
                </div>

                <nav className="relative flex items-center bg-gray-800/50 p-1 rounded-xl">
                    <div 
                       className="absolute bg-cyan-500/80 h-[calc(100%-8px)] rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-cyan-500/20"
                       style={{ width: '100px', transform: `translateX(${navPillIndex * 100}px)`, margin: '4px' }}
                    />
                    {views.map(view => (
                         <button
                            key={view.id}
                            onClick={() => onViewChange(view.id)}
                            className={clsx(
                                "relative px-3 py-2 rounded-lg text-sm font-semibold capitalize transition-colors w-[100px] flex items-center justify-center gap-2",
                                currentView === view.id ? 'text-white' : 'text-gray-300 hover:text-white'
                            )}
                        >
                           {view.icon} {view.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center space-x-2">
                     <button className="relative text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {alertCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-gray-900">{alertCount}</span>}
                    </button>
                    <button onClick={onExportJSON} title="Export Data as JSON" className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700/50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                    </button>
                     <button onClick={handleImportClick} title="Import Data from JSON" className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700/50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3-3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />

                    <button onClick={onAddLead} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-400/40 transform hover:scale-105 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span className="hidden sm:inline">Add Lead</span>
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <header className="sticky top-0 flex-shrink-0 bg-gray-900/60 backdrop-blur-xl border-b border-gray-700/40 shadow-2xl shadow-black/20 z-20">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 transition-all duration-300">
                    {selectedCount > 0 ? <BulkActionBar /> : <DefaultHeader />}
                </div>
            </div>
        </header>
    );
};

export default Header;

import React from 'react';

interface HeaderProps {
    currentView: 'pipeline' | 'dashboard';
    onViewChange: (view: 'pipeline' | 'dashboard') => void;
    onAddLead: () => void;
    onExport: () => void;
    alertCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onAddLead, onExport, alertCount }) => {
    
    const NavButton: React.FC<{ view: 'pipeline' | 'dashboard', children: React.ReactNode }> = ({ view, children }) => {
        const isActive = currentView === view;
        return (
            <button 
                onClick={() => onViewChange(view)} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
            >
                {children}
            </button>
        );
    };

    return (
        <header className="flex-shrink-0 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                           <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M13 16.818V18h-2v-1.182A6.994 6.994 0 0 1 6 12h2a5.002 5.002 0 0 0 9.112-2.839A5.042 5.042 0 0 0 13 6.12V4h-2v2.12c.795.215 1.51.611 2.115 1.159A3.001 3.001 0 0 1 11 14h2a3.001 3.001 0 0 0-2.885-2.161A2.973 2.973 0 0 1 8 12V8a6.994 6.994 0 0 1 5 4.818z"/></svg>
                        </div>
                        <h1 className="text-xl font-bold ml-3 text-white">CyberOcean CRM</h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-2 bg-gray-800/80 p-1 rounded-lg">
                        <NavButton view="pipeline">Pipeline</NavButton>
                        <NavButton view="dashboard">Dashboard</NavButton>
                    </nav>
                    <div className="flex items-center space-x-3">
                        {alertCount > 0 && (
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{alertCount}</span>
                            </div>
                        )}
                        <button onClick={onExport} className="hidden sm:block px-4 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">Export CSV</button>
                        <button 
                            onClick={onAddLead} 
                            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-600/30"
                        >
                            Add Lead
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
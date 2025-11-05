import React from 'react';

interface DocumentViewerProps {
    document: {
        name?: string;
        content: string; // Base64 data URL
        mimeType: string;
    };
    onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
    const isImage = document.mimeType.startsWith('image/');
    const isPdf = document.mimeType === 'application/pdf';

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex justify-center items-center p-4 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-700/50 animate-slideUp overflow-hidden"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="p-4 bg-gray-900/50 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-white truncate">{document.name || 'Document Preview'}</h2>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-1 bg-gray-900 overflow-auto">
                    {isImage && (
                        <div className="flex justify-center items-center h-full p-4">
                           <img src={document.content} alt={document.name || 'Image preview'} className="max-w-full max-h-full object-contain" />
                        </div>
                    )}
                    {isPdf && (
                        <iframe src={document.content} title={document.name || 'PDF Preview'} className="w-full h-full border-none" />
                    )}
                    {!isImage && !isPdf && (
                         <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <h3 className="text-xl font-semibold text-gray-300">Preview not available</h3>
                            <p>This file type ({document.mimeType}) cannot be previewed directly.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;

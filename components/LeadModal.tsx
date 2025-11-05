import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import { Lead, PipelineStage, ClientType, ReasonLostOrDelay, RIBType, Installment, Invoice } from '../types';
import { PIPELINE_STAGES, REASONS_LOST_DELAY, LEAD_SOURCES } from '../constants';
import DocumentViewer from './DocumentViewer';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (leadData: Omit<Lead, 'id' | 'dateAdded'>) => void;
    lead: Lead | null;
}

const initialLeadState: Omit<Lead, 'id' | 'dateAdded'> = {
    name: '',
    contact: '',
    email: '',
    type: 'Private Teacher',
    stage: 'New Lead',
    notes: '',
    source: '',
};

const inputStyles = "w-full bg-gray-800/50 border border-gray-700/70 rounded-lg h-11 px-4 text-white focus:bg-gray-800/70 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 placeholder:text-gray-500 shadow-sm";
const labelStyles = "block text-sm font-medium text-gray-400 mb-2";

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, lead }) => {
    const [formData, setFormData] = useState(initialLeadState);
    const [viewingDocument, setViewingDocument] = useState<{ name?: string, content: string, mimeType: string } | null>(null);


    useEffect(() => {
        if (isOpen) {
            if (lead) {
                 const toInputDate = (isoString?: string) => isoString ? isoString.split('T')[0] : '';
                setFormData({
                    ...initialLeadState,
                    ...lead,
                    demoStartDate: toInputDate(lead.demoStartDate),
                    demoEndDate: toInputDate(lead.demoEndDate),
                    paymentDate: toInputDate(lead.paymentDate),
                    recontactDate: toInputDate(lead.recontactDate),
                    installments: lead.installments?.map(inst => ({...inst, date: toInputDate(inst.date)}))
                });
            } else {
                setFormData(initialLeadState);
            }
        }
    }, [lead, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const numInstallments = formData.numberOfInstallments || 0;
        const currentInstallments = formData.installments || [];
        if (currentInstallments.length !== numInstallments) {
            const newInstallments = Array.from({ length: numInstallments }, (_, i) => 
                currentInstallments[i] || { date: '', documentName: '' }
            );
            setFormData(prev => ({ ...prev, installments: newInstallments }));
        }

        if (formData.ribType === 'Cyber Ocean RIB') {
            const numInvoices = formData.numberOfInvoices || 0;
            const currentInvoices = formData.invoices || [];
            if (currentInvoices.length !== numInvoices) {
                const newInvoices = Array.from({ length: numInvoices }, (_, i) => 
                    currentInvoices[i] || { documentName: '' }
                );
                setFormData(prev => ({ ...prev, invoices: newInvoices }));
            }
            if (formData.numberOfInvoices && formData.numberOfInstallments && formData.numberOfInvoices > formData.numberOfInstallments) {
                setFormData(prev => ({...prev, numberOfInvoices: prev.numberOfInstallments}))
            }
        } else {
             if (formData.invoices?.length || formData.numberOfInvoices) {
                setFormData(prev => ({ ...prev, invoices: [], numberOfInvoices: 0 }));
            }
        }
    }, [isOpen, formData.numberOfInstallments, formData.numberOfInvoices, formData.ribType]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'numberOfInstallments' || name === 'numberOfInvoices') {
             setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseInt(value, 10) }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
        }
    };
    
    const handleInstallmentDateChange = (index: number, value: string) => {
        const newInstallments = [...(formData.installments || [])];
        newInstallments[index] = { ...newInstallments[index], date: value };
        setFormData(prev => ({ ...prev, installments: newInstallments }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'installment' | 'invoice', index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (type === 'installment') {
                const newInstallments = [...(formData.installments || [])];
                newInstallments[index] = { 
                    ...newInstallments[index], 
                    documentName: file.name,
                    documentContent: content,
                    documentMimeType: file.type,
                };
                setFormData(prev => ({ ...prev, installments: newInstallments }));
            } else { // invoice
                const newInvoices = [...(formData.invoices || [])];
                newInvoices[index] = { 
                    ...newInvoices[index],
                    documentName: file.name,
                    documentContent: content,
                    documentMimeType: file.type,
                };
                setFormData(prev => ({ ...prev, invoices: newInvoices }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, contact: value || '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            demoStartDate: formData.demoStartDate ? new Date(formData.demoStartDate).toISOString() : undefined,
            demoEndDate: formData.demoEndDate ? new Date(formData.demoEndDate).toISOString() : undefined,
            paymentDate: formData.paymentDate ? new Date(formData.paymentDate).toISOString() : undefined,
            recontactDate: formData.recontactDate ? new Date(formData.recontactDate).toISOString() : undefined,
            installments: formData.installments?.map(inst => ({...inst, date: inst.date ? new Date(inst.date).toISOString() : ''}))
        };
        onSave(dataToSave);
    };

    if (!isOpen) return null;
    
    const Legend: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
        <legend className="text-sm font-semibold text-cyan-400 px-2 flex items-center gap-2 uppercase tracking-wider">
            {icon}
            <span>{children}</span>
        </legend>
    );

    const renderPaymentFields = () => (
         <fieldset className="space-y-6 rounded-lg p-5 border border-gray-700/80">
            <Legend icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}>
                Payment Tracking
            </Legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelStyles}>RIB Type</label>
                    <select name="ribType" value={formData.ribType || ''} onChange={handleChange} className={inputStyles}>
                        <option value="">Select RIB Type</option>
                        <option value="Private RIB">Private RIB</option>
                        <option value="Cyber Ocean RIB">Cyber Ocean RIB</option>
                    </select>
                </div>
            </div>

            {formData.ribType === 'Private RIB' && (
                <div>
                    <label className={labelStyles}>Number of Installments</label>
                    <select name="numberOfInstallments" value={formData.numberOfInstallments || ''} onChange={handleChange} className={inputStyles}>
                        <option value="">Select number</option>
                        {[...Array(5)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                </div>
            )}

            {formData.ribType === 'Cyber Ocean RIB' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyles}>Number of Installments</label>
                        <select name="numberOfInstallments" value={formData.numberOfInstallments || ''} onChange={handleChange} className={inputStyles}>
                           <option value="">Select number</option>
                           {[...Array(5)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className={labelStyles}>Number of Invoices</label>
                        <select name="numberOfInvoices" value={formData.numberOfInvoices || ''} onChange={handleChange} className={inputStyles}>
                           <option value="">Select number</option>
                           {[...Array(formData.numberOfInstallments || 5)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                        </select>
                    </div>
                </div>
            )}
            
            {formData.numberOfInstallments && formData.numberOfInstallments > 0 && (
                <div className="space-y-4">
                    <h4 className="text-base font-medium text-gray-200 pt-2 border-t border-gray-700/60">Installment Details</h4>
                    {formData.installments?.map((inst, index) => (
                        <div key={`inst-${index}`} className="p-4 bg-white/5 rounded-lg border border-gray-700/60">
                             <p className="col-span-2 text-sm font-semibold text-gray-200 mb-3">Installment {index + 1}</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                                    <input type="date" value={inst.date || ''} onChange={e => handleInstallmentDateChange(index, e.target.value)} className={`${inputStyles} h-10 text-sm`}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Document</label>
                                    <input type="file" onChange={e => handleFileChange(e, 'installment', index)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/20 file:text-cyan-300 hover:file:bg-cyan-600/40 file:cursor-pointer file:transition-all"/>
                                    {inst.documentName && (
                                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5 truncate">
                                            <span className="truncate pr-2">Current: {inst.documentName}</span>
                                            {inst.documentContent && inst.documentMimeType && (
                                                <button type="button" onClick={() => setViewingDocument({ name: inst.documentName, content: inst.documentContent!, mimeType: inst.documentMimeType! })} className="text-cyan-400 hover:text-cyan-300 font-semibold ml-2 flex-shrink-0">View</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {formData.ribType === 'Cyber Ocean RIB' && formData.numberOfInvoices && formData.numberOfInvoices > 0 && (
                <div className="space-y-4">
                     <h4 className="text-base font-medium text-gray-200 pt-2 border-t border-gray-700/60">Invoice Details</h4>
                    {formData.invoices?.map((inv, index) => (
                        <div key={`inv-${index}`} className="p-4 bg-white/5 rounded-lg border border-gray-700/60">
                             <p className="col-span-2 text-sm font-semibold text-gray-200 mb-3">Invoice {index + 1}</p>
                             <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Document</label>
                                <input type="file" onChange={e => handleFileChange(e, 'invoice', index)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/20 file:text-cyan-300 hover:file:bg-cyan-600/40 file:cursor-pointer file:transition-all"/>
                                {inv.documentName && (
                                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5 truncate">
                                        <span className="truncate pr-2">Current: {inv.documentName}</span>
                                        {inv.documentContent && inv.documentMimeType && (
                                            <button type="button" onClick={() => setViewingDocument({ name: inv.documentName, content: inv.documentContent!, mimeType: inv.documentMimeType! })} className="text-cyan-400 hover:text-cyan-300 font-semibold ml-2 flex-shrink-0">View</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </fieldset>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 animate-fadeIn backdrop-blur-sm">
                <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700/50 animate-slideUp">
                    <div className="p-6 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            {lead ? 'Edit Lead' : 'Add New Lead'}
                        </h2>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto">
                        <fieldset className="space-y-4 rounded-lg p-5 border border-gray-700/80">
                            <Legend icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                                Lead Information
                            </Legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div>
                                    <label className={labelStyles}>Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputStyles} placeholder="e.g., John Doe"/>
                                </div>
                                <div>
                                    <label className={labelStyles}>Contact (Phone/WhatsApp)</label>
                                    <PhoneInput
                                        international
                                        defaultCountry="TN"
                                        placeholder="Enter phone number"
                                        value={formData.contact}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelStyles}>Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputStyles} placeholder="e.g., john.doe@example.com"/>
                                </div>
                                <div>
                                    <label className={labelStyles}>Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className={inputStyles}>
                                        <option value="Private Teacher">Private Teacher</option>
                                        <option value="Center">Center</option>
                                    </select>
                                </div>
                                <div>
                                <label className={labelStyles}>Stage</label>
                                    <select name="stage" value={formData.stage} onChange={handleChange} className={inputStyles}>
                                        {PIPELINE_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyles}>Source</label>
                                    <select name="source" value={formData.source} onChange={handleChange} required className={inputStyles}>
                                        <option value="">Select a source</option>
                                        {LEAD_SOURCES.map(source => <option key={source} value={source}>{source}</option>)}
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                        
                        {(formData.stage !== 'New Lead' && formData.stage !== 'Contacted') && (
                            <fieldset className="space-y-4 rounded-lg p-5 border border-gray-700/80">
                                <Legend icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}>
                                    Stage Details
                                </Legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    {formData.stage === 'Delayed' || formData.stage === 'Lost - Refused' ? (
                                    <div>
                                        <label className={labelStyles}>Reason for Delay / Loss</label>
                                        <select name="reasonLostDelay" value={formData.reasonLostDelay || ''} onChange={handleChange} className={inputStyles}>
                                            <option value="">Select a reason</option>
                                            {REASONS_LOST_DELAY.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    ) : null}

                                    {formData.stage === 'Demo Active' && (<>
                                        <div>
                                            <label className={labelStyles}>Demo Start Date</label>
                                            <input type="date" name="demoStartDate" value={formData.demoStartDate || ''} onChange={handleChange} className={inputStyles}/>
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Demo End Date</label>
                                            <input type="date" name="demoEndDate" value={formData.demoEndDate || ''} onChange={handleChange} className={inputStyles}/>
                                        </div>
                                    </>)}
                                    
                                    {formData.stage === 'Closed - Paid' && (
                                        <div>
                                            <label className={labelStyles}>Payment Date</label>
                                            <input type="date" name="paymentDate" value={formData.paymentDate || ''} onChange={handleChange} className={inputStyles}/>
                                        </div>
                                    )}

                                    {formData.stage === 'Delayed' && (
                                        <div>
                                            <label className={labelStyles}>Re-contact Date</label>
                                            <input type="date" name="recontactDate" value={formData.recontactDate || ''} onChange={handleChange} className={inputStyles}/>
                                        </div>
                                    )}
                                </div>
                            </fieldset>
                        )}

                        {formData.stage === 'Closed - Paid' && renderPaymentFields()}
                        
                        <div>
                            <label className={labelStyles}>Notes / Conversation Summary</label>
                            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={4} className={`${inputStyles} h-auto py-3`} placeholder="Add relevant notes, conversation highlights, or next steps..."></textarea>
                        </div>
                    </form>
                    <div className="p-5 bg-gray-900/50 border-t border-gray-700/50 flex justify-end space-x-4 rounded-b-2xl flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-transparent border border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 transition-all">Cancel</button>
                        <button type="submit" onClick={handleSubmit} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-400/40 transform hover:scale-105 active:scale-95">Save Lead</button>
                    </div>
                </div>
            </div>
            {viewingDocument && (
                <DocumentViewer 
                    document={viewingDocument} 
                    onClose={() => setViewingDocument(null)} 
                />
            )}
        </>
    );
};

export default LeadModal;

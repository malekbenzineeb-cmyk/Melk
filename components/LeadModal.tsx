import React, { useState, useEffect } from 'react';
import { Lead, PipelineStage, ClientType, ReasonLostOrDelay } from '../types';
import { PIPELINE_STAGES, REASONS_LOST_DELAY } from '../constants';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (leadData: Omit<Lead, 'id' | 'dateAdded'>) => void;
    lead: Lead | null;
}

const initialLeadState: Omit<Lead, 'id' | 'dateAdded'> = {
    name: '',
    contact: '',
    type: 'Private Teacher',
    stage: 'New Lead',
    demoStartDate: '',
    demoEndDate: '',
    paymentDate: '',
    notes: '',
    source: '',
    reasonLostDelay: undefined,
    recontactDate: '',
};

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, lead }) => {
    const [formData, setFormData] = useState(initialLeadState);

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
                });
            } else {
                setFormData(initialLeadState);
            }
        }
    }, [lead, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            demoStartDate: formData.demoStartDate ? new Date(formData.demoStartDate).toISOString() : undefined,
            demoEndDate: formData.demoEndDate ? new Date(formData.demoEndDate).toISOString() : undefined,
            paymentDate: formData.paymentDate ? new Date(formData.paymentDate).toISOString() : undefined,
            recontactDate: formData.recontactDate ? new Date(formData.recontactDate).toISOString() : undefined,
        };
        onSave(dataToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Contact (Phone/WhatsApp)</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                <option value="Private Teacher">Private Teacher</option>
                                <option value="Center">Center</option>
                            </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Stage</label>
                            <select name="stage" value={formData.stage} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                {PIPELINE_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
                            <input type="text" name="source" value={formData.source} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                        </div>
                        {formData.stage === 'Delayed' || formData.stage === 'Lost - Refused' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Delay / Loss</label>
                            <select name="reasonLostDelay" value={formData.reasonLostDelay || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                <option value="">Select a reason</option>
                                {REASONS_LOST_DELAY.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        ) : null}

                         {formData.stage === 'Demo Active' && (<>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Demo Start Date</label>
                                <input type="date" name="demoStartDate" value={formData.demoStartDate || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Demo End Date</label>
                                <input type="date" name="demoEndDate" value={formData.demoEndDate || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                            </div>
                         </>)}
                        
                         {formData.stage === 'Closed - Paid' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Date</label>
                                <input type="date" name="paymentDate" value={formData.paymentDate || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                            </div>
                         )}

                         {formData.stage === 'Delayed' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Re-contact Date</label>
                                <input type="date" name="recontactDate" value={formData.recontactDate || ''} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                            </div>
                         )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Notes / Conversation Summary</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                    </div>
                </form>
                <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
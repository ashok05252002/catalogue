import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message, isProcessing = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={onClose}
                    disabled={isProcessing}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="text-rose-600" size={24} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title || 'Confirm Deletion'}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                        {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
                    </p>

                    <div className="flex w-full gap-3">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { createContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirm, setConfirm] = useState({ isOpen: false, message: '', subMessage: '', resolve: null });

    // ── Toasts ────────────────────────────────────────────────────────────────
    const addToast = (message, type = 'info', duration = 3500) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        if (duration) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    };

    const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    const getIcon = (type) => {
        switch (type) {
            case 'success': return 'check_circle';
            case 'error':   return 'cancel';
            case 'warning': return 'warning';
            default:        return 'info';
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success': return 'bg-green-500 shadow-[0_8px_32px_rgba(34,197,94,0.35)]';
            case 'error':   return 'bg-red-500 shadow-[0_8px_32px_rgba(239,68,68,0.35)]';
            case 'warning': return 'bg-amber-500 shadow-[0_8px_32px_rgba(245,158,11,0.35)]';
            default:        return 'bg-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.35)]';
        }
    };

    // ── Confirm dialog ────────────────────────────────────────────────────────
    const openConfirm = (message, subMessage = '') => {
        return new Promise((resolve) => {
            setConfirm({ isOpen: true, message, subMessage, resolve });
        });
    };

    const handleConfirm = (result) => {
        confirm.resolve(result);
        setConfirm({ isOpen: false, message: '', subMessage: '', resolve: null });
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast, openConfirm }}>
            {children}

            {/* ── Toast stack ── */}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[300px] max-w-sm rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-300 overflow-hidden relative ${getStyles(toast.type)}`}
                    >
                        <span className="material-symbols-outlined text-white text-xl shrink-0">
                            {getIcon(toast.type)}
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white leading-snug">{toast.message}</p>
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="text-white/60 hover:text-white transition-colors shrink-0">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Custom confirm dialog ── */}
            {confirm.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => handleConfirm(false)}
                    />
                    {/* Card */}
                    <div className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden p-7"
                         style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-red-400 text-2xl">warning</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base leading-snug mb-1">{confirm.message}</h3>
                                    {confirm.subMessage && (
                                        <p className="text-white/50 text-sm leading-relaxed">{confirm.subMessage}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleConfirm(false)}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleConfirm(true)}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Confirm
                                </button>
                            </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export default ToastContext;

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ToastContextType {
    showToast: (message: string, isSuccess: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<{ message: string; isSuccess: boolean } | null>(null);

    const showToast = (message: string, isSuccess: boolean) => {
        setToast({ message: message, isSuccess: isSuccess });
        // Auto-hide after 5 seconds
        setTimeout(() => setToast(null), 5000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Global Snackbar UI */}
            {toast && (
                <div className="fixed top-0 left-0 w-full flex justify-center px-4 pt-6"
                    style={{ zIndex: 10001, pointerEvents: 'none' }}
                >
                    <div
                        style={{ pointerEvents: 'auto' }}
                        className="w-full max-w-md shadow-2xl animate-in slide-in-from-top duration-300"
                    >
                        <div
                            style={{ backgroundColor: toast.isSuccess ? '#059669' : '#be123c', opacity: 1, borderRadius: '25px' }}
                            className={`
                                flex items-center justify-between p-4 rounded-2xl border-2
                                ${toast.isSuccess
                                    ? "bg-emerald-600 border-emerald-400 text-white"
                                    : "bg-rose-700 border-rose-500 text-white"}
                        `}
                        >
                            <div className="flex items-center space-x-3">
                                {toast.isSuccess ? (
                                    <CheckCircle2 className="h-6 w-6 text-emerald-100" />
                                ) : (
                                    <AlertCircle className="h-6 w-6 text-rose-100" />
                                )}
                                <div>
                                    <p className="font-bold text-xs uppercase tracking-widest opacity-80">
                                        {toast.isSuccess ? "Success" : "Error"}
                                    </p>
                                    <p className="text-sm font-medium">{toast.message}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setToast(null)}
                                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </ToastContext.Provider >
    );
};

export const useError = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useError must be used within ErrorProvider");
    return context;
};
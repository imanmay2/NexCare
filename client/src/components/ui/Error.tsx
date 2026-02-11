import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ErrorContextType {
    showError: (message: string, isSuccess: boolean) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<{ message: string; isSuccess: boolean } | null>(null);

    const showError = (message: string, isSuccess: boolean) => {
        setError({ message: message, isSuccess: isSuccess });
        // Auto-hide after 5 seconds
        setTimeout(() => setError(null), 5000);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}

            {/* Global Snackbar UI */}
            {error && (
                <div className="fixed top-0 left-0 w-full flex justify-center px-4 pt-6"
                    style={{ zIndex: 10001, pointerEvents: 'none' }}
                >
                    <div
                        style={{ pointerEvents: 'auto' }}
                        className="w-full max-w-md shadow-2xl animate-in slide-in-from-top duration-300"
                    >
                        <div
                            style={{ backgroundColor: error.isSuccess ? '#059669' : '#be123c', opacity: 1, borderRadius: '25px' }}
                            className={`
                                flex items-center justify-between p-4 rounded-2xl border-2
                                ${error.isSuccess
                                    ? "bg-emerald-600 border-emerald-400 text-white"
                                    : "bg-rose-700 border-rose-500 text-white"}
                        `}
                        >
                            <div className="flex items-center space-x-3">
                                {error.isSuccess ? (
                                    <CheckCircle2 className="h-6 w-6 text-emerald-100" />
                                ) : (
                                    <AlertCircle className="h-6 w-6 text-rose-100" />
                                )}
                                <div>
                                    <p className="font-bold text-xs uppercase tracking-widest opacity-80">
                                        {error.isSuccess ? "Success" : "Error"}
                                    </p>
                                    <p className="text-sm font-medium">{error.message}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setError(null)}
                                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </ErrorContext.Provider >
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useError must be used within ErrorProvider");
    return context;
};
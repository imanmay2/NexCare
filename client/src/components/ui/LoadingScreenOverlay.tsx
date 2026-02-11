export const LoadingOverlay = () => (
    <div
        style={{ zIndex: 9999 }}
        className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[4px] transition-all"
    >
        <div className="custom-spinner"></div>

        <p className="mt-4 text-blue-700 font-bold tracking-wide uppercase text-xs animate-pulse">
            Loading...
        </p>
    </div>
);
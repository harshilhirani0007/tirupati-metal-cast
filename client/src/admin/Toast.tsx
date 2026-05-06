import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-5 fade-in">
      <div
        className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl ${
          isSuccess
            ? 'bg-green-600 border-green-500'
            : 'bg-red-600 border-red-500'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={18} className="text-white mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={18} className="text-white mt-0.5 shrink-0" />
        )}
        <p className="text-sm font-medium text-white">
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-2 p-0.5 rounded transition-colors text-white hover:bg-white/20"
        >
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

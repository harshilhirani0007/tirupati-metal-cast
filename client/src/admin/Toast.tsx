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
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in">
      <div
        className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg backdrop-blur-sm ${
          isSuccess
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
        )}
        <p className={`text-sm font-medium ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-2 p-0.5 rounded transition-colors ${
            isSuccess
              ? 'text-green-400 hover:bg-green-500/20'
              : 'text-red-400 hover:bg-red-500/20'
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

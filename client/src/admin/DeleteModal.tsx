import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteModal({ open, title, message, itemName, onConfirm, onCancel, loading }: DeleteModalProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-3xl border p-6 shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-200 p-1">
            <X size={18} />
          </button>
        </div>

        <h2 className={`font-black text-lg mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h2>
        <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {message}
        </p>
        {itemName && (
          <p className={`text-sm font-semibold mb-6 p-3 rounded-xl ${dark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
            "{itemName}"
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
              dark
                ? 'border-slate-700 text-slate-400 hover:text-slate-200'
                : 'border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <><Trash2 size={14} /> Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

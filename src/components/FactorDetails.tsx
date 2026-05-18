import React from 'react';
import { EurovisionSong, translations } from '../data';
import { 
  X,
  Target,
  Music,
  MapPin,
  Clock,
  Layers,
  BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  factor: {
    id: string;
    label: string;
    type: string;
    connectedSongs: EurovisionSong[];
  } | null;
  onClose: () => void;
  onReset: () => void;
}

export const FactorDetails: React.FC<Props> = ({ factor, onClose, onReset }) => {
  if (!factor) return null;

  const connectedCountries = Array.from(new Set(factor.connectedSongs.map(s => s.country)));

  return (
    <AnimatePresence>
      <motion.div
        id="factor-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-200 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold mb-2 uppercase tracking-wider">
                Faktor mreže: {translations[factor.type] || factor.type}
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {factor.label}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="flex gap-2 mb-8">
            <button 
                onClick={onReset}
                className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
                Resetiraj prikaz
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Music className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Pjesme</span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                {factor.connectedSongs.length}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Države</span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                {connectedCountries.length}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-4">
                  Povezane države
                </h3>
                <div className="flex flex-wrap gap-2">
                    {connectedCountries.map(c => (
                        <span key={c} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                            {c}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-4">
                  Povezane pjesme
                </h3>
                <div className="space-y-3">
                    {factor.connectedSongs.sort((a, b) => b.year - a.year).map(s => (
                        <div key={`${s.year}-${s.country}`} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-blue-500 uppercase">{s.year} • {s.country}</span>
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-slate-200">#{s.final_place}</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900">{s.song}</h4>
                            <p className="text-xs text-slate-500">{s.artist}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <BarChart className="w-3 h-3 text-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400">{s.total_points} bodova</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

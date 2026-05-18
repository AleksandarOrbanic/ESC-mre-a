
import React from 'react';
import { EurovisionSong, translations } from '../data';
import { 
  Trophy, 
  MapPin, 
  User, 
  Music, 
  Languages, 
  Zap, 
  BarChart3, 
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  song: EurovisionSong | null;
  onClose: () => void;
}

export const SongDetails: React.FC<Props> = ({ song, onClose }) => {
  if (!song) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="side-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-200 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold mb-2">
                Natjecanje {song.year}.
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {song.song}
              </h2>
              <p className="text-lg text-slate-600 font-medium">{song.artist}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Plasman</span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                #{song.final_place}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {song.result_category === 'winner' ? 'Pobjednik' : 'Top 3'}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Bodovi</span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                {song.total_points}
              </p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 pb-2">
              Atributi nastupa
            </h3>
            
            <div className="grid gap-4">
              <AttributeItem icon={<MapPin className="w-4 h-4" />} label="Država" value={`${song.country} (${translations[song.region] || song.region})`} />
              <AttributeItem icon={<Music className="w-4 h-4" />} label="Žanr" value={translations[song.genre] || song.genre} />
              <AttributeItem icon={<Languages className="w-4 h-4" />} label="Jezik" value={translations[song.language] || song.language} />
              <AttributeItem icon={<User className="w-4 h-4" />} label="Tip izvođača" value={translations[song.performer_type] || song.performer_type} />
              <AttributeItem icon={<Calendar className="w-4 h-4" />} label="Redoslijed" value={`${song.running_order} (${translations[song.running_order_half] || song.running_order_half})`} />
              <AttributeItem icon={<Zap className="w-4 h-4" />} label="Jača podrška" value={song.stronger_support === 'televote' ? 'Publika' : song.stronger_support === 'jury' ? 'Žiri' : 'Uravnoteženo'} />
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex gap-4 mb-4">
               <div className="flex-1">
                 <p className="text-xs font-bold text-blue-600 uppercase mb-1">Žiri</p>
                 <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600" 
                      style={{ width: `${(song.jury_points / (song.jury_points + song.televote_points)) * 100}%` }} 
                    />
                 </div>
                 <p className="text-sm font-bold mt-1">{song.jury_points} bodova</p>
               </div>
               <div className="flex-1">
                 <p className="text-xs font-bold text-pink-600 uppercase mb-1 text-right">Publika</p>
                 <div className="h-2 w-full bg-pink-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-600 ml-auto" 
                      style={{ width: `${(song.televote_points / (song.jury_points + song.televote_points)) * 100}%` }} 
                    />
                 </div>
                 <p className="text-sm font-bold mt-1 text-right">{song.televote_points} bodova</p>
               </div>
            </div>
          </div>

          {song.description && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 pb-2">
                Kontekst i nastup
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm italic">
                "{song.description}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const AttributeItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

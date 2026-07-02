import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Activity, Network, Award, HelpCircle, ShieldAlert } from 'lucide-react';
import { EurovisionSong, translations } from '../../data';
import { calculateMetrics } from '../../lib/metrics';

interface AdvancedMetricsDashboardProps {
  songs: EurovisionSong[];
  onClose: () => void;
}

export const AdvancedMetricsDashboard: React.FC<AdvancedMetricsDashboardProps> = ({ songs, onClose }) => {
  // Compute metrics dynamically from the library
  const { nodes, countryStats, degreeCentrality, closeness, betweenness } = useMemo(() => {
    return calculateMetrics(songs);
  }, [songs]);

  // List of factors to calculate top factors from (exclude songs and countries)
  const topFactors = useMemo(() => {
    return nodes
      .filter(n => n.type !== 'song' && n.type !== 'country')
      .map(n => {
        // Find human readable type
        let CroatianType = '';
        switch (n.type) {
          case 'genre': CroatianType = 'Žanr'; break;
          case 'language': CroatianType = 'Jezik'; break;
          case 'performer_type': CroatianType = 'Tip izvođača'; break;
          case 'half': CroatianType = 'Polovica nastupa'; break;
          case 'support': CroatianType = 'Podrška'; break;
          default: CroatianType = 'Faktor';
        }

        const degree = degreeCentrality[n.id] || 0;
        const closenessVal = closeness[n.id] || 0;
        const betweennessVal = betweenness[n.id] || 0;

        return {
          id: n.id,
          label: translations[n.label] || n.label,
          type: CroatianType,
          connectedSongsCount: degree, // For factor nodes, degree is exactly their connection to songs
          degree,
          closeness: closenessVal,
          betweenness: betweennessVal
        };
      })
      .sort((a, b) => b.degree - a.degree);
  }, [nodes, degreeCentrality, closeness, betweenness]);

  // Top countries
  const sortedCountries = useMemo(() => {
    return [...countryStats].sort((a, b) => b.top3 - a.top3 || b.degree - a.degree);
  }, [countryStats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md"
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Slide-in Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 155 }}
        className="relative w-full lg:w-7/12 xl:w-1/2 h-full bg-slate-900 border-l border-slate-800 text-white flex flex-col shadow-2xl z-10"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950/50 sticky top-0 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 text-blue-400 p-2.5 rounded-xl border border-blue-500/30">
              <Network className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">Mrežne Metrike</h2>
              <p className="text-xs text-blue-400 font-bold tracking-widest leading-none mt-1">
                Kvantitativni pregled ključnih čvorova i čimbenika u ESC mreži.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors hover:bg-slate-700 active:scale-95"
            aria-label="Zatvori"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar bg-slate-900/60">
          
          {/* Explanatory Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-blue-400 font-black text-xs uppercase mb-1 tracking-wider">Stupanj (Degree)</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pokazuje s koliko je drugih čvorova neki čvor izravno povezan u mreži.
                </p>
              </div>
              <div className="text-[10px] text-blue-500 font-bold uppercase mt-4">Mjera popularnosti</div>
            </div>

            <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-purple-400 font-black text-xs uppercase mb-1 tracking-wider">Između (Betweenness)</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pokazuje koliko često se čvor pojavljuje kao "most" ili posrednik između drugih čvorova.
                </p>
              </div>
              <div className="text-[10px] text-purple-500 font-bold uppercase mt-4">Mjera utjecaja i mrežne sinapse</div>
            </div>

            <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex flex-col justify-between font-sans">
              <div>
                <div className="text-amber-400 font-black text-xs uppercase mb-1 tracking-wider">Objašnjenje metrika</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  U glavnoj interpretaciji koriste se degree centrality i betweenness centrality. Degree pokazuje koliko je država ili faktor izravno povezan s drugim čvorovima, dok betweenness pokazuje ima li čvor ulogu mosta između različitih dijelova mreže. Closeness centrality nije uključena u glavnu tablicu jer u ovoj mreži ne daje dovoljno izražene razlike za interpretaciju.
                </p>
              </div>
              <div className="text-[10px] text-amber-500 font-bold uppercase mt-4">Metodološka napomena</div>
            </div>
          </div>

          {/* Top Factors Ranking Panel */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Najčešći faktori među top 3 pjesmama</h3>
            </div>
            
            <div className="bg-slate-950/40 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-slate-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Faktor</th>
                      <th className="px-5 py-4">Tip</th>
                      <th className="px-5 py-4 text-center">Broj povezanih pjesama</th>
                      <th className="px-5 py-4 text-right">Udio u uzorku</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {topFactors.slice(0, 10).map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                          <span className="text-slate-500 font-mono w-4">{idx + 1}.</span>
                          <span className="capitalize">{item.label}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700/60">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-300">
                          {item.connectedSongsCount}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-blue-400 font-black">
                          {((item.connectedSongsCount / 45) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 px-1 leading-relaxed">
              Broj povezanih pjesama odgovara degree vrijednosti faktorskog čvora, odnosno pokazuje koliko se puta određeni faktor pojavljuje u analiziranom uzorku od 45 pjesama.
            </p>
          </div>

          {/* Top Countries Ranking Panel */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">TOP DRŽAVE PREMA MREŽNIM METRIKAMA</h3>
            </div>

            <div className="bg-slate-950/40 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-slate-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Država</th>
                      <th className="px-5 py-4 text-center">Plasmana (Top 3)</th>
                      <th className="px-5 py-4 text-center">Pobjeda</th>
                      <th className="px-5 py-4 text-right">Betweenness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sortedCountries.map((item, idx) => (
                      <tr key={item.name} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white flex items-center gap-1.5">
                          <span className="text-slate-500 font-mono w-4">{idx + 1}.</span>
                          <span>{item.name}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="px-2 py-0.5 bg-slate-800 text-white font-mono font-black rounded-full border border-slate-700">
                            {item.top3}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {item.wins > 0 ? (
                            <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-300 font-mono font-black rounded-full border border-amber-500/30">
                              {item.wins} ⭐
                            </span>
                          ) : (
                            <span className="text-slate-600 font-bold">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-purple-400 font-bold">
                          {item.betweenness.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Theoretical Methodological Warning */}
          <div className="p-5 bg-blue-950/20 border border-blue-500/20 rounded-2xl flex gap-3.5">
            <div className="bg-blue-500/10 text-blue-400 p-2 rounded-xl h-fit border border-blue-500/10">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-1">METODOLOŠKA NAPOMENA</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Veća centralnost ne znači da faktor uzrokuje uspjeh, nego da ima važniju ili češću poziciju unutar analizirane mreže."
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-850 bg-slate-950/40 text-center text-[10px] text-slate-500">
          ESC MREŽA • Kolegij: Istraživanje društvenih mreža • Aleksandar Orbanić
        </div>
      </motion.div>
    </motion.div>
  );
};

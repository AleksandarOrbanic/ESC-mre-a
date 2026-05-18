
import React, { useState, useMemo } from 'react';
import { EurovisionGraph } from './components/EurovisionGraph';
import { SongDetails } from './components/SongDetails';
import { FactorDetails } from './components/FactorDetails';
import { EurovisionSong, songsData, translations } from './data';
import { Info, BarChart, Network, Layers, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedSong, setSelectedSong] = useState<EurovisionSong | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<{ id: string, label: string, type: string, connectedSongs: EurovisionSong[] } | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);

  // Simple statistics for the header/sidebar
  const stats = useMemo(() => {
    const genres: Record<string, number> = {};
    const languages: Record<string, number> = {};
    const regions: Record<string, number> = {};

    songsData.forEach(s => {
      s.genre.split('/').forEach(g => {
        const key = g.trim();
        genres[key] = (genres[key] || 0) + 1;
      });
      languages[s.language] = (languages[s.language] || 0) + 1;
      regions[s.region] = (regions[s.region] || 0) + 1;
    });

    const topGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topRegions = Object.entries(regions).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { topGenres, topRegions };
  }, []);

  const resetView = () => {
    setSelectedSong(null);
    setSelectedFactor(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              ESC <span className="text-blue-600">mreža</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              Analiza pjesama koje su završile u top 3 od 2010. do 2025.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 px-6 border-x border-slate-100">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Ukupno pjesama</p>
              <p className="font-black text-slate-900">{songsData.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Najčešći žanr</p>
              <p className="font-black text-blue-600 underline decoration-2 decoration-blue-200">
                {translations[stats.topGenres[0][0]] || stats.topGenres[0][0]}
              </p>
            </div>
          </div>
          
          {(selectedSong || selectedFactor) && (
            <button 
              onClick={resetView}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-xs font-bold active:scale-95"
            >
              <RefreshCcw className="w-4 h-4" />
              Resetiraj prikaz
            </button>
          )}

          <button 
            onClick={() => setShowMethodology(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-xs font-bold"
          >
            <Info className="w-4 h-4" />
            Metodologija
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 relative flex flex-col min-w-0">
          <div className="flex-1">
             <EurovisionGraph 
                onSelectSong={setSelectedSong} 
                selectedSong={selectedSong} 
                onSelectFactor={setSelectedFactor}
                selectedFactorId={selectedFactor?.id || null}
             />
          </div>
          
          {/* Bottom Overlay Info */}
          <div className="absolute bottom-6 left-6 pointer-events-none max-w-sm">
            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-xl pointer-events-auto">
               <div className="flex items-center gap-2 mb-2">
                 <Layers className="w-4 h-4 text-blue-500" />
                 <span className="text-xs font-bold uppercase text-slate-500">Analiza mrežne centralnosti</span>
               </div>
               <p className="text-sm text-slate-600 leading-relaxed">
                 Veličina čvora prikazuje koliko se često određeni čimbenik pojavljuje među pjesmama koje su završile u top 3. Čimbenici poput <span className="font-bold text-slate-900">"{translations[stats.topRegions[0][0]] || stats.topRegions[0][0]}"</span> ili <span className="font-bold text-slate-900">"{translations[stats.topGenres[0][0]] || stats.topGenres[0][0]}"</span> su najveći jer su najzastupljeniji.
               </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <aside className="hidden lg:flex w-80 bg-white border-l border-slate-200 flex-col overflow-y-auto shrink-0 transition-all">
           {!selectedFactor && !selectedSong ? (
             <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                   <BarChart className="w-4 h-4 text-blue-500" />
                   <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Čimbenici uspjeha</h2>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex justify-between items-end">
                      Vodeće regije
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Učestalost</span>
                    </h3>
                    <div className="space-y-2">
                      {stats.topRegions.map(([name, count]) => (
                        <div key={name} className="group">
                          <div className="flex justify-between items-center text-xs mb-1">
                             <span className="text-slate-600 font-medium">{translations[name] || name}</span>
                             <span className="text-slate-400 font-bold">{count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-400 transition-all group-hover:bg-emerald-500" 
                              style={{ width: `${(count / songsData.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex justify-between items-end">
                      Dominantni žanrovi
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Učestalost</span>
                    </h3>
                    <div className="space-y-2">
                      {stats.topGenres.map(([name, count]) => (
                        <div key={name} className="group">
                          <div className="flex justify-between items-center text-xs mb-1">
                             <span className="text-slate-600 font-medium capitalize text-[10px]">
                                {translations[name] || name}
                             </span>
                             <span className="text-slate-400 font-bold">{count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 transition-all group-hover:bg-amber-500" 
                              style={{ width: `${(count / songsData.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                      Interaktivnost: Povucite čvorove za istraživanje odnosa, koristite kotačić miša za zumiranje. Kliknite na bilo koji čvor faktora (žanr, regija...) za filtriranje mreže.
                    </p>
                  </div>
                </div>
             </div>
           ) : (
             <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <Network className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <h3 className="text-slate-900 font-bold mb-2">Prikaz je filtriran</h3>
                <p className="text-xs text-slate-500 mb-6 px-4">
                    Trenutno gledate detaljan prikaz odabranog elementa mreže. Koristite gumb "Resetiraj prikaz" za povratak.
                </p>
                <button 
                    onClick={resetView}
                    className="py-2 px-6 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all"
                >
                    Vrati se na puni prikaz
                </button>
             </div>
           )}
        </aside>
      </main>

      {/* Details Side Panel */}
      <SongDetails 
        song={selectedSong} 
        onClose={() => setSelectedSong(null)} 
      />

      <FactorDetails 
        factor={selectedFactor}
        onClose={() => setSelectedFactor(null)}
        onReset={resetView}
      />

      {/* Methodology Modal */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
                <button 
                    onClick={() => setShowMethodology(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <RefreshCcw className="w-5 h-5 text-slate-400 rotate-45" />
                </button>
                
                <h2 className="text-2xl font-black text-slate-900 mb-6">Metodološka Napomena</h2>
                
                <div className="space-y-4 text-slate-600">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-800">
                            Veličina čvora prikazuje koliko se često određeni čimbenik pojavljuje među pjesmama koje su završile u top 3. Veći čvor ne znači da je taj čimbenik uzrokovao uspjeh, nego da je češće prisutan u analiziranom uzorku.
                        </p>
                    </div>
                    
                    <p className="text-sm leading-relaxed">
                        Grafički prikaz temelji se na <span className="font-bold text-slate-900">mrežnoj analizi i teoriji grafova</span> primijenjenoj na pjesme koje su ostvarile plasman u Top 3 na Euroviziji između 2010. i 2024. godine (te planirane podatke za 2025.).
                    </p>
                    
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>Veličina čvora: Označava učestalost pojavljivanja određenog elementa (žanr, jezik, tip izvođača itd.).</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>Interaktivno istraživanje: Filtrirajte mrežu klikom na faktore kako biste izolirali povezane pjesme i države.</span>
                        </li>
                    </ul>
                </div>
                
                <button 
                  onClick={() => setShowMethodology(false)}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  Razumijem
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

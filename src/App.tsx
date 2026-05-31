import React, { useState, useMemo } from 'react';
import { EurovisionGraph } from './components/EurovisionGraph';
import { SongDetails } from './components/SongDetails';
import { FactorDetails } from './components/FactorDetails';
import { AdvancedMetricsDashboard } from './components/analytics/AdvancedMetricsDashboard';
import { EurovisionSong, songsData, translations } from './data';
import { calculateMetrics } from './lib/metrics';
import { Info, Network, Layers, RefreshCcw, Landmark, HelpCircle, BarChart, MapPin, Sparkles, Sliders, Volume2, Calendar, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedSong, setSelectedSong] = useState<EurovisionSong | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<{ id: string, label: string, type: string, connectedSongs: EurovisionSong[] } | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const resetView = () => {
    setSelectedSong(null);
    setSelectedFactor(null);
    setSearchTerm('');
  };

  // Compile structured distinct factors from songsData for programmatically searching
  const allFactors = useMemo(() => {
    const list: { id: string; label: string; type: string; rawType: string; connectedSongs: EurovisionSong[]; countries: string[] }[] = [];

    // A) Genres (split by '/')
    const genres = Array.from(new Set(songsData.flatMap(s => s.genre.split('/').map(g => g.trim()))));
    genres.forEach(g => {
      const connectedSongs = songsData.filter(s => s.genre.split('/').map(x => x.trim()).includes(g));
      const countries = Array.from(new Set(connectedSongs.map(s => s.country)));
      list.push({
        id: `genre-${g}`,
        label: translations[g] || g,
        type: 'Žanr',
        rawType: 'genre',
        connectedSongs,
        countries
      });
    });

    // B) Languages
    const langs = Array.from(new Set(songsData.map(s => s.language)));
    langs.forEach(l => {
      const connectedSongs = songsData.filter(s => s.language === l);
      const countries = Array.from(new Set(connectedSongs.map(s => s.country)));
      list.push({
        id: `lang-${l}`,
        label: translations[l] || l,
        type: 'Jezik',
        rawType: 'language',
        connectedSongs,
        countries
      });
    });

    // C) Performer Types
    const perfTypes = Array.from(new Set(songsData.map(s => s.performer_type)));
    perfTypes.forEach(p => {
      const connectedSongs = songsData.filter(s => s.performer_type === p);
      const countries = Array.from(new Set(connectedSongs.map(s => s.country)));
      list.push({
        id: `perf-${p}`,
        label: translations[p] || p,
        type: 'Tip izvođača',
        rawType: 'performer_type',
        connectedSongs,
        countries
      });
    });

    // D) Halves
    const halves = Array.from(new Set(songsData.map(s => s.running_order_half)));
    halves.forEach(h => {
      const connectedSongs = songsData.filter(s => s.running_order_half === h);
      const countries = Array.from(new Set(connectedSongs.map(s => s.country)));
      list.push({
        id: `half-${h}`,
        label: translations[h] || h,
        type: 'Polovica nastupa',
        rawType: 'half',
        connectedSongs,
        countries
      });
    });

    // E) Supports
    const supports = Array.from(new Set(songsData.map(s => s.stronger_support)));
    supports.forEach(sup => {
      const connectedSongs = songsData.filter(s => s.stronger_support === sup);
      const countries = Array.from(new Set(connectedSongs.map(s => s.country)));
      list.push({
        id: `support-${sup}`,
        label: translations[sup] || sup,
        type: 'Podrška',
        rawType: 'support',
        connectedSongs,
        countries
      });
    });

    return list;
  }, []);

  // Filter results dynamically for songs, countries and factors
  const matchingSongs = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase().trim();
    return songsData.filter(s => 
      s.song.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.year.toString().includes(q)
    );
  }, [searchTerm]);

  const matchingCountries = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase().trim();
    const distinctCountries = Array.from(new Set(songsData.map(s => s.country)));
    return distinctCountries
      .filter(c => c.toLowerCase().includes(q))
      .map(c => {
        const songs = songsData.filter(s => s.country === c);
        return {
          country: c,
          top3: songs.length,
          songs
        };
      });
  }, [searchTerm]);

  const matchingFactors = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase().trim();
    return allFactors.filter(f => 
      f.label.toLowerCase().includes(q) || 
      f.id.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q)
    );
  }, [searchTerm, allFactors]);

  // Node Color configurations mapped for the legend display
  const legendItems = [
    { label: 'Pjesma', color: '#3b82f6', icon: Sparkles },
    { label: 'Država', color: '#22c55e', icon: Landmark },
    { label: 'Žanr', color: '#f59e0b', icon: Volume2 },
    { label: 'Jezik', color: '#8b5cf6', icon: Info },
    { label: 'Tip izvođača', color: '#ec4899', icon: Sliders },
    { label: 'Polovica nastupa', color: '#06b6d4', icon: Calendar },
    { label: 'Podrška', color: '#f97316', icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-900 font-sans selection:bg-blue-900 selection:text-blue-100 overflow-hidden text-slate-100">
      
      {/* 1. PERMANENT LEFT SIDEBAR PANEL */}
      <aside className="w-80 md:w-96 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 h-full overflow-hidden text-slate-200">
        
        {/* Header section with Application Logo/Title and Search Input */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wider leading-none">
                ESC <span className="text-blue-500">MREŽA</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1.5">
                Analiza top 3 pjesama Eurovizije (2010.–2025.)
              </p>
            </div>
          </div>

          {/* Smart Search Bar */}
          <div className="relative">
            <input
              type="text"
              id="smart-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pretraži: Loreen, 2024, Croatia, pop..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-semibold"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            {searchTerm && (
              <button
                id="clear-search-button-x"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                title="Očisti pretragu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          
          {searchTerm.trim() !== '' ? (
            /* SEARCH RESULTS VIEW */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xs font-black text-slate-450 uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  Rezultati pretrage
                </h2>
                <button
                  id="btn-clear-search"
                  onClick={() => setSearchTerm('')}
                  className="text-[10px] font-black text-rose-500 hover:text-rose-450 uppercase tracking-wider bg-rose-500/10 px-2.5 py-1 rounded-lg transition-colors border border-rose-500/20"
                >
                  Očisti pretragu
                </button>
              </div>

              {/* Checks if there are absolutely no results */}
              {matchingSongs.length === 0 && matchingCountries.length === 0 && matchingFactors.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <HelpCircle className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-400 font-bold">Nema rezultata za "{searchTerm}"</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Pokušaj unijeti godinu (npr. 2024), državu (npr. Sweden), izvođača (npr. Loreen), žanr (npr. pop), jezik (npr. engleski) ili tip podrške (npr. publika).
                  </p>
                </div>
              ) : null}

              {/* 1. SONG RESULTS */}
              {matchingSongs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-blue-450 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Pjesme ({matchingSongs.length})
                  </h3>
                  <div className="space-y-2">
                    {matchingSongs.map((song) => (
                      <button
                        key={`${song.year}-${song.country}`}
                        id={`song-result-${song.year}-${song.country}`}
                        onClick={() => {
                          setSelectedSong(song);
                          setSelectedFactor(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all space-y-1 block ${selectedSong === song ? 'ring-2 ring-blue-500 border-transparent bg-slate-900' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-white hover:text-blue-400 transition-colors leading-tight">{song.song}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                            {song.year}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {song.artist} <span className="text-slate-600">•</span> {song.country}
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/30 mt-1.5">
                          <span className="flex items-center gap-1 font-mono text-amber-500 font-bold">
                            🏆 {song.final_place}. mjesto
                          </span>
                          <span className="font-mono text-slate-400 font-semibold">
                            {song.total_points} bodova
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. COUNTRY RESULTS */}
              {matchingCountries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-green-450 uppercase tracking-widest flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-green-550" />
                    Države ({matchingCountries.length})
                  </h3>
                  <div className="space-y-2">
                    {matchingCountries.map(({ country, top3, songs }) => (
                      <div
                        key={country}
                        id={`country-result-${country}`}
                        className="p-3 rounded-xl border border-slate-850 bg-slate-900/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            id={`btn-focus-country-${country}`}
                            onClick={() => {
                              setSelectedFactor({
                                id: `country-${country}`,
                                label: country,
                                type: 'country',
                                connectedSongs: songs
                              });
                              setSelectedSong(null);
                            }}
                            className="text-xs font-black text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            {country}
                          </button>
                          <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[9px] font-black rounded-full">
                            {top3} {top3 === 1 ? 'pjesma' : top3 < 5 ? 'pjesme' : 'pjesama'} (Top 3)
                          </span>
                        </div>
                        
                        {/* Interactive list of song names inside country result */}
                        <div className="space-y-1.5 pl-2.5 border-l border-slate-800">
                          {songs.map(s => (
                            <button
                              key={`${s.year}-${s.song}`}
                              id={`song-under-country-${s.year}-${s.country}`}
                              onClick={() => {
                                setSelectedSong(s);
                                setSelectedFactor(null);
                              }}
                              className="text-[11px] text-slate-300 hover:text-white transition-colors flex items-center gap-1 w-full text-left py-0.5"
                            >
                              <span className="text-slate-500 font-mono">[{s.year}]</span> <span className="hover:underline">{s.song}</span> ({s.final_place}.)
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. FACTOR RESULTS */}
              {matchingFactors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-500" />
                    Faktori ({matchingFactors.length})
                  </h3>
                  <div className="space-y-2">
                    {matchingFactors.map((f) => (
                      <div
                        key={f.id}
                        id={`factor-result-${f.id}`}
                        className="p-3 rounded-xl border border-slate-850 bg-slate-900/40 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            id={`btn-focus-factor-${f.id}`}
                            onClick={() => {
                              setSelectedFactor({
                                id: f.id,
                                label: f.label,
                                type: f.rawType,
                                connectedSongs: f.connectedSongs
                              });
                              setSelectedSong(null);
                            }}
                            className="text-xs font-black text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                          >
                            <span>⚡ {f.label}</span>
                          </button>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-350 border border-slate-700 text-[9px] font-black rounded-full uppercase tracking-wider">
                            {f.type}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 space-y-1.5 font-medium bg-slate-950/20 p-2.5 rounded-lg border border-slate-800/40">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-500">Povezane pjesme:</span>
                            <span className="font-mono text-white font-bold">{f.connectedSongs.length}</span>
                          </div>
                          <div className="text-[10px] pt-1.5 border-t border-slate-800/40 mt-1">
                            <span className="text-slate-500">Povezane države:</span>{' '}
                            <span className="text-slate-300 font-semibold">{f.countries.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* A) LEGENDA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Legenda
                  </h2>
                </div>
                
                {/* Node types mapping */}
                <div className="grid grid-cols-1 gap-2.5">
                  {legendItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/40 hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-slate-950 transition-transform" style={{ backgroundColor: item.color, ringColor: item.color }} />
                          <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                        </div>
                        <IconComponent className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    );
                  })}
                </div>

                {/* Song borders/placement mapping */}
                <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Obrub čvorova pjesama</p>
                  
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/30 border border-slate-800/30">
                    <div className="w-4 h-4 rounded-full border-2 border-[#FBBF24] bg-blue-600/60" />
                    <span className="text-xs font-semibold text-slate-300 text-[11px]">1. mjesto (Pobjednik)</span>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/30 border border-slate-800/30">
                    <div className="w-4 h-4 rounded-full border-2 border-[#94A3B8] bg-blue-600/60" />
                    <span className="text-xs font-semibold text-slate-300 text-[11px]">2. mjesto</span>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/30 border border-slate-800/30">
                    <div className="w-4 h-4 rounded-full border-2 border-[#B45309] bg-blue-600/60" />
                    <span className="text-xs font-semibold text-slate-300 text-[11px]">3. mjesto</span>
                  </div>
                </div>

                {/* Relations/Links mapping */}
                <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Legenda veza u grafu</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-3 p-2 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                      <div className="w-6 h-1 rounded bg-[#22c55e]" />
                      <span className="text-[11px] font-medium text-slate-300">pjesma – država</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                      <div className="w-6 h-1 rounded bg-[#f59e0b]" />
                      <span className="text-[11px] font-medium text-slate-300">pjesma – žanr</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                      <div className="w-6 h-1 rounded bg-[#8b5cf6]" />
                      <span className="text-[11px] font-medium text-slate-300">pjesma – jezik</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                      <div className="w-6 h-1 rounded bg-[#ec4899]" />
                      <span className="text-[11px] font-medium text-slate-300">pjesma – tip izvođača</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                      <div className="w-6 h-1 rounded bg-[#06b6d4]" />
                      <span className="text-[11px] font-medium text-slate-300">pjesma – polovina nastupa</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                      <div className="w-6 h-1 rounded bg-[#f97316]" />
                      <span className="text-[11px] font-medium text-slate-300">pjesma – podrška</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* B) OPIS / METODOLOGIJA */}
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/70 p-5 space-y-4">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Network className="w-4 h-4 text-blue-500" />
                  Mrežna Istraživanja
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  "Ova mreža prikazuje čimbenike povezane s pjesmama koje su završile među prve tri na Euroviziji od 2010. do 2025. godine. Pjesme su povezane s državom, regijom, žanrom, jezikom, tipom izvođača, polovinom nastupa i dominantnom podrškom publike ili žirija. Cilj analize nije utvrditi uzrok uspjeha, nego uočiti obrasce koji se najčešće ponavljaju među najuspješnijim pjesmama."
                </p>

                {/* Explore Metrics Button */}
                <button
                  id="btn-explore-dashboard"
                  onClick={() => setShowDashboard(true)}
                  className="w-full mt-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 border border-blue-500/30"
                >
                  <BarChart className="w-4 h-4" />
                  Istraži mrežne metrike
                </button>
              </div>
            </>
          )}

        </div>

        {/* Permanent Sidebar footer with developer citation */}
        <div className="p-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          ESC Network App • Aleksandar Orbanić
        </div>
      </aside>

      {/* 2. MAIN CENTRAL GRAPH AREA */}
      <main className="flex-1 h-full relative flex flex-col bg-slate-900 overflow-hidden">
        
        {/* Floating Top Header bar for resets and quick actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          {(selectedSong || selectedFactor || searchTerm.trim() !== '') && (
            <button 
              id="btn-clear-all-states"
              onClick={resetView}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 text-blue-400 border border-slate-800 hover:bg-slate-900 text-xs font-black uppercase tracking-wider transition-all hover:scale-105"
            >
              <RefreshCcw className="w-4 h-4 animate-spin-slow" />
              Prikaži cijelu mrežu
            </button>
          )}

          <button 
            id="btn-methodology"
            onClick={() => setShowMethodology(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-900 text-xs font-bold transition-all"
          >
            <Info className="w-4 h-4 text-blue-500" />
            Metodologija
          </button>
        </div>

        {/* Central interactive network visualization element */}
        <div className="flex-1 w-full h-full">
          <EurovisionGraph 
            onSelectSong={setSelectedSong} 
            selectedSong={selectedSong} 
            onSelectFactor={setSelectedFactor}
            selectedFactorId={selectedFactor?.id || null}
            searchTerm={searchTerm}
          />
        </div>

        {/* Isolated Subgraph visual indicator banner */}
        {(selectedSong || selectedFactor || searchTerm.trim() !== '') && (
          <div className="absolute bottom-6 left-6 pointer-events-none z-10">
            <div className="bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-auto">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Pregled je trenutno filtriran • {selectedSong ? 'Odabrana pjesma' : (selectedFactor ? 'Odabran faktor' : 'Aktivna pretraga')}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 3. DETAILS/MODAL SLIDING SHEETS (RIGHT-SIDE) */}
      <AnimatePresence>
        {selectedSong && (
          <SongDetails 
            song={selectedSong} 
            onClose={() => setSelectedSong(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFactor && (
          <FactorDetails 
            factor={selectedFactor}
            onClose={() => setSelectedFactor(null)}
            onReset={resetView}
          />
        )}
      </AnimatePresence>

      {/* Advanced sliding dark metrics dashboard from the right */}
      <AnimatePresence>
        {showDashboard && (
          <AdvancedMetricsDashboard
            songs={songsData}
            onClose={() => setShowDashboard(false)}
          />
        )}
      </AnimatePresence>

      {/* Methodology Overview Modal popup */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-800 text-slate-100 rounded-[28px] shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl">
                  <Network className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Metodološki okvir aplikacije</h2>
              </div>

              <div className="space-y-6 text-slate-300 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                <p className="text-sm leading-relaxed text-slate-400">
                  Ova verzija predstavlja osnovnu mrežu ključnih faktora uspješnih pjesama, usmjerenu na analizu karakteristika najuspješnijih izvedbi.
                </p>

                <p className="text-sm leading-relaxed">
                  Aplikacija koristi principe teorije grafova i analize društvenih mreža za vizualizaciju strukturirane korelacije između glazbenih, produkcijskih i geografskih parametara (poput država, žanrova, jezika, tipa izvođača te razine podrške) i njihovog natjecateljskog ishoda (Top 3 plasman) na natjecanju Eurovizije u razdoblju od 2010. do 2025. godine.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/60">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Mrežna struktura bez regija</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      U ovoj verziji mreža je fokusirana na izravne veze između pjesama i njihovih autentičnih svojstava, uključujući državu podrijetla. Time se osigurava maksimalna čitljivost i neposredan uvid u najuspješnije obrasce bez nepotrebne regionalne agregacije.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-white uppercase text-xs tracking-wider">Ključni principi vizualizacije</h3>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span className="text-xs text-slate-400">
                        <strong className="text-slate-200">Centralnost čvorova:</strong> Veličina svih ispitnih faktora temelji se na stupnju njihove povezanosti (degree centrality), što znači da se vizualno ističu najfrekventniji obrasci.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span className="text-xs text-slate-400">
                        <strong className="text-slate-200">Konceptualno zaključivanje:</strong> Statističke korelacije opisuju raspodjelu u uzorku, no ne insinuiraju da posjedovanje nekog faktora (poput engleskog jezika) mehanički jamči natjecateljski trijumf.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowMethodology(false)}
                  className="px-6 py-3 bg-slate-800 text-white hover:bg-slate-750 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  U redu, nastavi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


import React from 'react';
import { Info } from 'lucide-react';

interface NetworkMetricsProps {
  countryStats: {
    name: string;
    region: string;
    top3: number;
    wins: number;
    degree: number;
    betweenness: number;
  }[];
}

export const NetworkMetrics: React.FC<NetworkMetricsProps> = ({ countryStats }) => {
  const sortedStats = [...countryStats].sort((a, b) => b.top3 - a.top3 || b.degree - a.degree).slice(0, 15);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-2">Mrežne metrike država</h3>
      <p className="text-xs text-slate-500 mb-6 italic">Top 15 država prema plasmanima i mrežnoj važnosti.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <div className="bg-blue-600 p-2 rounded-lg h-fit shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-blue-900 uppercase mb-1">Degree Centrality</h4>
            <p className="text-[10px] text-blue-700 leading-tight">
              Pokazuje koliko je država povezana s drugim čvorovima. Visoka vrijednost sugerira širok spektar faktora koji prate uspjeh države.
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg h-fit shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-900 uppercase mb-1">Betweenness Centrality</h4>
            <p className="text-[10px] text-emerald-700 leading-tight">
              Pokazuje ulogu "mosta". Države s visokim betweennessom često povezuju različite žanrovske ili regijske klastere.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
          <div className="bg-amber-600 p-2 rounded-lg h-fit shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-900 uppercase mb-1">Ograničenje analize</h4>
            <p className="text-[10px] text-amber-700 leading-tight">
              Metrike prikazuju obrasce povezanosti u analiziranom uzorku (Top 3), a ne apsolutni uzrok uspjeha na natjecanju.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-900 text-white uppercase font-black">
            <tr>
              <th className="px-4 py-3">Država</th>
              <th className="px-4 py-3">Regija</th>
              <th className="px-4 py-3 text-center">Top 3</th>
              <th className="px-4 py-3 text-center">Pobjede</th>
              <th className="px-4 py-3 text-right">Degree</th>
              <th className="px-4 py-3 text-right">Betweenness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedStats.map((item) => (
              <tr key={item.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-black text-slate-800">{item.name}</td>
                <td className="px-4 py-3 text-slate-500 font-medium">{item.region}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full font-bold">{item.top3}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.wins > 0 ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-black">
                      {item.wins}
                    </span>
                  ) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-4 py-3 text-right font-mono text-blue-600 font-bold">{item.degree}</td>
                <td className="px-4 py-3 text-right font-mono text-emerald-600 font-bold">
                  {item.betweenness.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

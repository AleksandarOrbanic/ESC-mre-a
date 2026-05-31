
import React, { useMemo } from 'react';
import { EurovisionSong, translations } from '../../data';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface GeographicAnalysisProps {
  songs: EurovisionSong[];
}

export const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({ songs }) => {
  const regionData = useMemo(() => {
    const counts: Record<string, number> = {};
    songs.forEach(s => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: translations[name] || name, value }))
      .sort((a, b) => b.value - a.value);
  }, [songs]);

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1e40af', '#1d4ed8', '#4f46e5', '#6366f1'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-2">Uspjeh po regijama</h3>
      <p className="text-xs text-slate-500 mb-6">Distribucija Top 3 plasmana prema geografskim blokovima.</p>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="h-64 w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {regionData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-slate-700">{item.name}</span>
                  <span className="text-slate-400 font-mono">{item.value}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all" 
                    style={{ 
                      width: `${(item.value / songs.length) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

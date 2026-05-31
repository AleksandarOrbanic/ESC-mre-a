
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { translations } from '../../data';

interface FactorRankingProps {
  factorCounts: Record<string, number>;
}

export const FactorRanking: React.FC<FactorRankingProps> = ({ factorCounts }) => {
  const data = Object.entries(factorCounts)
    .map(([id, count]) => {
      const name = id.split('-')[1];
      return {
        id,
        name: translations[name] || name,
        count: count as number
      };
    })
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-6">Top 10 faktora uspjeha</h3>
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#2563eb' : '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-400 uppercase font-black">
            <tr>
              <th className="px-4 py-3">Faktor</th>
              <th className="px-4 py-3 text-right">Broj poveznica (Degree)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-700">{item.name}</td>
                <td className="px-4 py-3 text-right font-mono text-blue-600">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

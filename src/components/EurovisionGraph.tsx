
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { EurovisionSong, songsData, translations } from '../data';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'song' | 'country' | 'region' | 'genre' | 'language' | 'performer_type' | 'half' | 'support' | 'result' | 'place';
  data?: EurovisionSong;
  degree?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

interface Props {
  onSelectSong: (song: EurovisionSong | null) => void;
  selectedSong: EurovisionSong | null;
  onSelectFactor: (factor: { id: string, label: string, type: string, connectedSongs: EurovisionSong[] } | null) => void;
  selectedFactorId: string | null;
}

const nodeColors: Record<Node['type'], string> = {
  song: '#3b82f6', // blue-500
  country: '#ef4444', // red-500
  region: '#10b981', // emerald-500
  genre: '#f59e0b', // amber-500
  language: '#8b5cf6', // violet-500
  performer_type: '#ec4899', // pink-500
  half: '#06b6d4', // cyan-500
  support: '#f97316', // orange-500
  result: '#71717a', // zinc-500
  place: '#84cc16', // lime-500
};

const placeBorderColors: Record<number, string> = {
  1: '#FBBF24', // Gold
  2: '#94A3B8', // Silver
  3: '#B45309', // Bronze
};

export const EurovisionGraph: React.FC<Props> = ({ 
  onSelectSong, 
  selectedSong, 
  onSelectFactor, 
  selectedFactorId 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { allNodes, allLinks } = useMemo(() => {
    const nodesMap = new Map<string, Node>();
    const links: Link[] = [];

    const addNode = (id: string, label: string, type: Node['type'], data?: EurovisionSong) => {
      if (!nodesMap.has(id)) {
        nodesMap.set(id, { id, label, type, data });
      }
    };

    songsData.forEach((s) => {
      const songId = `song-${s.year}-${s.country}`;
      const songLabel = `${s.year}: ${s.song}`;
      
      addNode(songId, songLabel, 'song', s);
      
      // Relations
      addNode(`country-${s.country}`, s.country, 'country');
      links.push({ source: songId, target: `country-${s.country}` });

      const regionLabel = translations[s.region] || s.region;
      addNode(`region-${s.region}`, regionLabel, 'region');
      links.push({ source: `country-${s.country}`, target: `region-${s.region}` });

      // Split genres
      s.genre.split('/').forEach(g => {
        const trimmed = g.trim();
        const genreId = `genre-${trimmed}`;
        const genreLabel = translations[trimmed] || trimmed;
        addNode(genreId, genreLabel, 'genre');
        links.push({ source: songId, target: genreId });
      });

      const langLabel = translations[s.language] || s.language;
      addNode(`lang-${s.language}`, langLabel, 'language');
      links.push({ source: songId, target: `lang-${s.language}` });

      const perfLabel = translations[s.performer_type] || s.performer_type;
      addNode(`perf-${s.performer_type}`, perfLabel, 'performer_type');
      links.push({ source: songId, target: `perf-${s.performer_type}` });

      const halfLabel = translations[s.running_order_half] || s.running_order_half;
      addNode(`half-${s.running_order_half}`, halfLabel, 'half');
      links.push({ source: songId, target: `half-${s.running_order_half}` });

      const supportLabel = translations[s.stronger_support] || s.stronger_support;
      addNode(`support-${s.stronger_support}`, supportLabel, 'support');
      links.push({ source: songId, target: `support-${s.stronger_support}` });
    });

    const nodesList = Array.from(nodesMap.values());

    // Calculate degree centrality
    nodesList.forEach(node => {
      node.degree = links.filter(l => l.source === node.id || l.target === node.id).length;
    });

    return { allNodes: nodesList, allLinks: links };
  }, []);

  // Filtered nodes and links based on selectedFactorId
  const { nodes, links } = useMemo(() => {
    if (!selectedFactorId) return { nodes: allNodes, links: allLinks };

    const factorNode = allNodes.find(n => n.id === selectedFactorId);
    if (!factorNode) return { nodes: allNodes, links: allLinks };

    const visibleNodeIds = new Set<string>();
    visibleNodeIds.add(selectedFactorId);

    // Find songs connected to this factor
    const connectedSongIds = allLinks
      .filter(l => (l.source === selectedFactorId || l.target === selectedFactorId))
      .map(l => l.source === selectedFactorId ? (l.target as string) : (l.source as string))
      .filter(id => id.startsWith('song-'));

    connectedSongIds.forEach(id => visibleNodeIds.add(id));

    // Find countries connected to these songs
    const connectedCountryIds = allLinks
      .filter(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return (connectedSongIds.includes(sourceId) && targetId.startsWith('country-')) ||
               (connectedSongIds.includes(targetId) && sourceId.startsWith('country-'));
      })
      .map(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return connectedSongIds.includes(sourceId) ? targetId : sourceId;
      });

    connectedCountryIds.forEach(id => visibleNodeIds.add(id));

    // Find regions connected to these countries
    allLinks.forEach(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        if (connectedCountryIds.includes(sourceId) && targetId.startsWith('region-')) visibleNodeIds.add(targetId);
        if (connectedCountryIds.includes(targetId) && sourceId.startsWith('region-')) visibleNodeIds.add(sourceId);
    });

    const filteredNodes = allNodes.filter(n => visibleNodeIds.has(n.id));
    const filteredLinks = allLinks.filter(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [allNodes, allLinks, selectedFactorId]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Filtered data for simulation
    const simulationNodes = nodes.map(d => ({ ...d }));
    const simulationLinks = links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<Node>(simulationNodes)
      .force('link', d3.forceLink<Node, Link>(simulationLinks).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>().radius(d => {
          const radius = d.type === 'song' ? 10 : Math.max(8, (d.degree || 1) * 1.5);
          return radius + 40; // High padding for labels below
      }));

    const link = g.append('g')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(simulationLinks)
      .join('line')
      .attr('stroke-width', 1.5);

    const node = g.append('g')
      .selectAll<SVGGElement, Node>('g')
      .data(simulationNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d: Node) => {
        if (d.type === 'song' && d.data) {
          onSelectSong(d.data);
          onSelectFactor(null);
        } else {
          // Select individual factor
          const connectedSongs = allLinks
            .filter(l => (typeof l.source === 'string' ? l.source : (l.source as any).id) === d.id || 
                         (typeof l.target === 'string' ? l.target : (l.target as any).id) === d.id)
            .map(l => {
              const otherId = (typeof l.source === 'string' ? l.source : (l.source as any).id) === d.id ? 
                             (typeof l.target === 'string' ? l.target : (l.target as any).id) : 
                             (typeof l.source === 'string' ? l.source : (l.source as any).id);
              return allNodes.find(n => n.id === otherId);
            })
            .filter(n => n?.type === 'song' && n.data)
            .map(n => n!.data!);

          onSelectFactor({
            id: d.id,
            label: d.label,
            type: d.type,
            connectedSongs
          });
          onSelectSong(null);
        }
      })
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', (d: Node) => d.type === 'song' ? (d.data?.final_place === 1 ? 14 : 10) : Math.max(6, (d.degree || 1) * 1.6))
      .attr('fill', (d: Node) => nodeColors[d.type])
      .attr('stroke', (d: Node) => d.type === 'song' ? placeBorderColors[d.data?.final_place || 0] || '#fff' : '#fff')
      .attr('stroke-width', (d: Node) => d.type === 'song' ? 3 : 2)
      .attr('class', (d: Node) => (selectedSong && d.data === selectedSong) || (selectedFactorId === d.id) ? 'ring-4 ring-blue-400 ring-offset-2' : '');

    node.append('text')
      .attr('dy', (d: Node) => {
          const radius = d.type === 'song' ? (d.data?.final_place === 1 ? 14 : 10) : Math.max(6, (d.degree || 1) * 1.6);
          return radius + 15;
      })
      .attr('text-anchor', 'middle')
      .text((d: Node) => d.label.length > 20 ? d.label.substring(0, 17) + '...' : d.label)
      .attr('font-size', (d: Node) => d.type === 'song' ? '12px' : '9px')
      .attr('fill', '#1e293b')
      .attr('font-weight', (d: Node) => d.type === 'song' ? '900' : '500')
      .style('pointer-events', 'none')
      .append('title')
      .text((d: Node) => d.label);

    // Song-specific detailed hover
    node.filter((d: Node) => d.type === 'song').append('title')
      .text((d: Node) => {
        const s = d.data!;
        const genreLabel = translations[s.genre] || s.genre;
        const langLabel = translations[s.language] || s.language;
        const perfLabel = translations[s.performer_type] || s.performer_type;
        const halfLabel = translations[s.running_order_half] || s.running_order_half;
        const supportLabel = translations[s.stronger_support] || s.stronger_support;
        
        return `Pjesma: ${s.song}\nIzvođač: ${s.artist}\nDržava: ${s.country}\nGodina: ${s.year}\nPlasman: #${s.final_place} (${s.result_category === 'winner' ? 'Pobjednik' : 'Top 3'})\nUkupni bodovi: ${s.total_points}\nŽanr: ${genreLabel}\nJezik: ${langLabel}\nTip izvođača: ${perfLabel}\nRedoslijed nastupa: ${s.running_order}\nPolovica nastupa: ${halfLabel}\nJača podrška: ${supportLabel}`;
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, onSelectSong, onSelectFactor, selectedSong, selectedFactorId, allNodes, allLinks]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-slate-50 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-4 rounded-lg border border-slate-200 shadow-sm pointer-events-auto">
        <h3 className="text-sm font-bold mb-2 text-slate-800">Legenda</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(nodeColors).filter(([type]) => !['result', 'place'].includes(type)).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] capitalize text-slate-600 font-medium">
                {translations[type] || type.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#FBBF24] bg-[#3b82f6]" />
                <span className="text-[10px] text-slate-600">1. mjesto (Pobjednik)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#94A3B8] bg-[#3b82f6]" />
                <span className="text-[10px] text-slate-600">2. mjesto</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#B45309] bg-[#3b82f6]" />
                <span className="text-[10px] text-slate-600">3. mjesto</span>
            </div>
        </div>
      </div>
    </div>
  );
};

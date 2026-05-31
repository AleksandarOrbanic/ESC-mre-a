
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { EurovisionSong, songsData, translations } from '../data';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'song' | 'country' | 'genre' | 'language' | 'performer_type' | 'half' | 'support' | 'result' | 'place';
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
  searchTerm?: string;
}

const isExactSearchMatch = (d: Node, query: string): boolean => {
  if (!query) return false;
  const q = query.toLowerCase().trim();
  if (d.type === 'song' && d.data) {
    return d.data.year.toString().includes(q) ||
           d.data.artist.toLowerCase().includes(q) ||
           d.data.song.toLowerCase().includes(q);
  }
  if (d.type === 'country') {
    return d.label.toLowerCase().includes(q);
  }
  return d.label.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
};

const nodeColors: Record<Node['type'], string> = {
  song: '#3b82f6', // blue-500
  country: '#22c55e', // green-500
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

// Helper to determine the relationship type, color, and Croatian description of links
const getLinkDetails = (l: Link) => {
  const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
  const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
  
  // Find which ID is the factor and what type of factor it is
  const factorId = targetId.startsWith('song-') ? sourceId : targetId;
  
  if (factorId.startsWith('country-')) {
    return { color: '#22c55e', text: 'pjesma pripada državi' };
  } else if (factorId.startsWith('genre-')) {
    return { color: '#f59e0b', text: 'pjesma ima žanr' };
  } else if (factorId.startsWith('lang-')) {
    return { color: '#8b5cf6', text: 'pjesma je izvedena na jeziku' };
  } else if (factorId.startsWith('perf-')) {
    return { color: '#ec4899', text: 'pjesma ima tip izvođača' };
  } else if (factorId.startsWith('half-')) {
    return { color: '#06b6d4', text: 'pjesma je nastupila u polovici finala' };
  } else if (factorId.startsWith('support-')) {
    return { color: '#f97316', text: 'pjesma je imala jaču podršku' };
  }
  
  return { color: '#cbd5e1', text: 'poveznica' };
};

export const EurovisionGraph: React.FC<Props> = ({ 
  onSelectSong, 
  selectedSong, 
  onSelectFactor, 
  selectedFactorId,
  searchTerm
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

  // Filtered nodes and links based on selectedFactorId & selectedSong & searchTerm
  const { nodes, links } = useMemo(() => {
    // Case 0: Active search term filtering
    if (searchTerm && searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase().trim();
      const visibleNodeIds = new Set<string>();

      // Match nodes directly
      const matchedNodes = allNodes.filter(n => {
        if (n.type === 'song' && n.data) {
          return n.data.year.toString().includes(q) ||
                 n.data.artist.toLowerCase().includes(q) ||
                 n.data.song.toLowerCase().includes(q);
        }
        if (n.type === 'country') {
          return n.label.toLowerCase().includes(q);
        }
        return n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
      });

      matchedNodes.forEach(n => {
        visibleNodeIds.add(n.id);

        if (n.type === 'song' && n.data) {
          // Rule 1 & 3 & 4 (Song match): Add song and all its connected factors (including country)
          allLinks.forEach(l => {
            const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
            const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
            if (sId === n.id) visibleNodeIds.add(tId);
            if (tId === n.id) visibleNodeIds.add(sId);
          });
        } else if (n.type === 'country') {
          // Rule 2 (Country match): Add matched country, all songs of this country, and all connected factors of those songs
          const countrySongs = allNodes.filter(sn => sn.type === 'song' && sn.data?.country === n.label);
          countrySongs.forEach(songNode => {
            visibleNodeIds.add(songNode.id);
            allLinks.forEach(l => {
              const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
              const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
              if (sId === songNode.id) visibleNodeIds.add(tId);
              if (tId === songNode.id) visibleNodeIds.add(sId);
            });
          });
        } else {
          // Rule 5 (Factor match): Add matched factor node, all songs connected to it, and their country nodes
          allLinks.forEach(l => {
            const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
            const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
            const otherId = sId === n.id ? tId : (tId === n.id ? sId : null);
            if (otherId && otherId.startsWith('song-')) {
              visibleNodeIds.add(otherId);
              const songNode = allNodes.find(sn => sn.id === otherId);
              if (songNode?.data?.country) {
                visibleNodeIds.add(`country-${songNode.data.country}`);
              }
            }
          });
        }
      });

      const filteredNodes = allNodes.filter(n => visibleNodeIds.has(n.id));
      const filteredLinks = allLinks.filter(l => {
        const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return visibleNodeIds.has(sId) && visibleNodeIds.has(tId);
      });

      return { nodes: filteredNodes, links: filteredLinks };
    }

    // Case 1: Active factor selected
    if (selectedFactorId) {
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

      const filteredNodes = allNodes.filter(n => visibleNodeIds.has(n.id));
      const filteredLinks = allLinks.filter(l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
          return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
      });

      return { nodes: filteredNodes, links: filteredLinks };
    }

    // Case 2: Active song selected
    if (selectedSong) {
      const songId = `song-${selectedSong.year}-${selectedSong.country}`;
      const visibleNodeIds = new Set<string>();
      visibleNodeIds.add(songId);

      // Find all neighbors of this song node
      const connectedFactorIds = allLinks
        .filter(l => {
          const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
          const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
          return sId === songId || tId === songId;
        })
        .map(l => {
          const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
          const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
          return sId === songId ? tId : sId;
        });

      connectedFactorIds.forEach(id => visibleNodeIds.add(id));

      const filteredNodes = allNodes.filter(n => visibleNodeIds.has(n.id));
      const filteredLinks = allLinks.filter(l => {
        const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        return (sId === songId && visibleNodeIds.has(tId)) || (tId === songId && visibleNodeIds.has(sId));
      });

      return { nodes: filteredNodes, links: filteredLinks };
    }

    return { nodes: allNodes, links: allLinks };
  }, [allNodes, allLinks, selectedFactorId, selectedSong, searchTerm]);

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
      .force('link', d3.forceLink<Node, Link>(simulationLinks).id(d => d.id).distance(135))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>().radius(d => {
          const radius = d.type === 'song' ? 12 : Math.max(8, (d.degree || 1) * 1.8);
          return radius + 55; // Spacious padding to prevent overlapping labels
      }));

    // Draw customized, color-coded relationships
    const link = g.append('g')
      .selectAll('line')
      .data(simulationLinks)
      .join('line')
      .attr('stroke', (d: any) => getLinkDetails(d).color)
      .attr('stroke-opacity', 0.15)
      .attr('stroke-width', 1.2);

    // Append relationship descriptive tooltips to lines
    link.append('title')
      .text((d: any) => {
        const details = getLinkDetails(d);
        const sourceLabel = typeof d.source === 'object' ? (d.source as any).label : d.source;
        const targetLabel = typeof d.target === 'object' ? (d.target as any).label : d.target;
        return `${sourceLabel} ➔ ${details.text} ➔ ${targetLabel}`;
      });

    const node = g.append('g')
      .selectAll<SVGGElement, Node>('g')
      .data(simulationNodes)
      .join('g')
      .attr('class', 'node-group')
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

    // Append rich tooltip SVG title to group
    node.append('title')
      .text((d: Node) => {
        if (d.type === 'song' && d.data) {
          const s = d.data;
          const juryVal = s.jury_score !== undefined && s.jury_score !== null ? s.jury_score : 'nije dostupno';
          const televoteVal = s.televote_score !== undefined && s.televote_score !== null ? s.televote_score : 'nije dostupno';
          
          const juryLabel = s.split_metric_type === 'avg_rank_lower_is_better' ? 'Prosječni rang žirija' : 'Bodovi žirija';
          const televoteLabel = s.split_metric_type === 'avg_rank_lower_is_better' ? 'Prosječni rang publike' : 'Bodovi publike';
          const noteStr = s.split_metric_type === 'avg_rank_lower_is_better' ? '\n(Napomena: niža vrijednost znači bolji rang)' : '';
          
          const supportLabel = s.stronger_support === 'televote' ? 'Publika' : s.stronger_support === 'jury' ? 'Žiri' : 'Uravnoteženo';
          const genreLabel = translations[s.genre] || s.genre;
          const langLabel = translations[s.language] || s.language;
          const performerLabel = translations[s.performer_type] || s.performer_type;
          const halfLabel = translations[s.running_order_half] || s.running_order_half;

          return `Pjesma: ${s.song}
Izvođač: ${s.artist}
Država: ${s.country}
Godina: ${s.year}
Plasman: ${s.final_place}. mjesto
Ukupni bodovi: ${s.total_points}
${juryLabel}: ${juryVal}
${televoteLabel}: ${televoteVal}
Tip split metrike: ${s.split_metric_type || 'nije dostupno'}
Jača podrška: ${supportLabel}
Žanr: ${genreLabel}
Jezik: ${langLabel}
Tip izvođača: ${performerLabel}
Redoslijed nastupa: ${s.running_order}
Polovica nastupa: ${halfLabel}${noteStr}`;
        }
        return d.label;
      });

    node.append('circle')
      .attr('r', (d: Node) => {
        const baseRadius = d.type === 'song' ? (d.data?.final_place === 1 ? 14 : 10) : Math.max(6, (d.degree || 1) * 1.6);
        return searchTerm && isExactSearchMatch(d, searchTerm) ? baseRadius * 1.25 : baseRadius;
      })
      .attr('fill', (d: Node) => nodeColors[d.type])
      .attr('stroke', (d: Node) => {
        if (searchTerm && isExactSearchMatch(d, searchTerm)) {
          return '#f43f5e'; // Rose-magenta match highlight
        }
        return d.type === 'song' ? placeBorderColors[d.data?.final_place || 0] || '#020617' : '#020617';
      })
      .attr('stroke-width', (d: Node) => {
        if (searchTerm && isExactSearchMatch(d, searchTerm)) return 5;
        return d.type === 'song' ? 3 : 2;
      })
      .attr('class', (d: Node) => (selectedSong && d.data === selectedSong) || (selectedFactorId === d.id) ? 'ring-4 ring-blue-400 ring-offset-2' : '');

    node.append('text')
      .attr('dy', (d: Node) => {
          const radius = d.type === 'song' ? (d.data?.final_place === 1 ? 14 : 10) : Math.max(6, (d.degree || 1) * 1.6);
          const finalRadius = searchTerm && isExactSearchMatch(d, searchTerm) ? radius * 1.25 : radius;
          return finalRadius + 15;
      })
      .attr('text-anchor', 'middle')
      .text((d: Node) => d.label.length > 20 ? d.label.substring(0, 17) + '...' : d.label)
      .attr('font-size', (d: Node) => d.type === 'song' ? '12px' : '9px')
      .attr('fill', (d: Node) => searchTerm && isExactSearchMatch(d, searchTerm) ? '#fbbf24' : '#f1f5f9')
      .attr('font-weight', (d: Node) => {
        if (d.type === 'song') return '900';
        return searchTerm && isExactSearchMatch(d, searchTerm) ? '900' : '500';
      })
      .style('pointer-events', 'none');

    // Interactive Hover: highlighting only the connected components of hoveredNode
    node
      .on('pointerover', function (event, d: Node) {
        // Collect direct neighbors of hovered node
        const neighborIds = new Set<string>();
        neighborIds.add(d.id);

        links.forEach(l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
          if (sourceId === d.id) neighborIds.add(targetId);
          if (targetId === d.id) neighborIds.add(sourceId);
        });

        // Dim unconnected nodes on hover, highlight hovered + connected nodes
        node
          .transition()
          .duration(120)
          .style('opacity', (n: Node) => neighborIds.has(n.id) ? 1.0 : 0.15);

        // Turn direct link paths bright, thick, and fully visible
        link
          .transition()
          .duration(120)
          .attr('stroke', (l: any) => {
            const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
            const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
            if (sourceId === d.id || targetId === d.id) {
              return getLinkDetails(l).color;
            }
            return 'rgba(255, 255, 255, 0.05)';
          })
          .attr('stroke-width', (l: any) => {
            const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
            const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
            return (sourceId === d.id || targetId === d.id) ? 3.0 : 0.8;
          })
          .style('stroke-opacity', (l: any) => {
            const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
            const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
            return (sourceId === d.id || targetId === d.id) ? 1.0 : 0.03;
          });
      })
      .on('pointerout', function () {
        // Reset nodes to default opacity
        node
          .transition()
          .duration(120)
          .style('opacity', 1.0);

        // Reset links to relaxed muted state
        link
          .transition()
          .duration(120)
          .attr('stroke', (l: any) => getLinkDetails(l).color)
          .attr('stroke-width', 1.2)
          .style('stroke-opacity', 0.15);
      });

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
    <div ref={containerRef} className="w-full h-full relative bg-slate-950 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

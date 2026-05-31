
import { EurovisionSong } from '../data';

export interface Node {
  id: string;
  label: string;
  type: 'song' | 'country' | 'genre' | 'language' | 'performer_type' | 'half' | 'support';
  year?: number;
  place?: number;
}

export interface Link {
  source: string;
  target: string;
}

export function calculateMetrics(songs: EurovisionSong[]) {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const factorCounts: Record<string, number> = {};

  // Track unique countries
  const countries = Array.from(new Set(songs.map(s => s.country)));

  // Build the network
  songs.forEach(song => {
    const songId = `song-${song.year}-${song.country}`;
    nodes.push({
      id: songId,
      label: song.song,
      type: 'song',
      year: song.year,
      place: song.final_place
    });

    const addLink = (factorId: string, label: string, type: Node['type']) => {
      if (!nodes.find(n => n.id === factorId)) {
        nodes.push({ id: factorId, label, type });
      }
      links.push({ source: songId, target: factorId });
      factorCounts[factorId] = (factorCounts[factorId] || 0) + 1;
    };

    addLink(`country-${song.country}`, song.country, 'country');
    addLink(`lang-${song.language}`, song.language, 'language');
    addLink(`type-${song.performer_type}`, song.performer_type, 'performer_type');
    addLink(`half-${song.running_order_half}`, song.running_order_half, 'half');
    addLink(`support-${song.stronger_support}`, song.stronger_support, 'support');

    // Handle multiple genres
    song.genre.split('/').forEach(g => {
      const genre = g.trim();
      addLink(`genre-${genre}`, genre, 'genre');
    });
  });

  // Degree Centrality
  const degreeCentrality: Record<string, number> = {};
  nodes.forEach(node => {
    degreeCentrality[node.id] = links.filter(l => l.source === node.id || l.target === node.id).length;
  });

  // Betweenness Centrality (Simplified for Countries)
  // For each country node, how many pairs of (Factor, Factor) or (Factor, Song) have their shortest path through this country?
  // Since it's a bipartite-like graph, we can approximate or use a simple BFS for each node.
  const betweenness: Record<string, number> = {};
  nodes.forEach(n => betweenness[n.id] = 0);

  // Small graph (approx 100-150 nodes), we can afford a simple BFS-based betweenness
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  links.forEach(l => {
    adj[l.source].push(l.target);
    adj[l.target].push(l.source);
  });

  nodes.forEach(s => {
    const stack: string[] = [];
    const P: Record<string, string[]> = {};
    const sigma: Record<string, number> = {};
    const d: Record<string, number> = {};
    
    nodes.forEach(n => {
      P[n.id] = [];
      sigma[n.id] = 0;
      d[n.id] = -1;
    });

    sigma[s.id] = 1;
    d[s.id] = 0;

    const Q: string[] = [s.id];
    while (Q.length > 0) {
      const v = Q.shift()!;
      stack.push(v);
      adj[v].forEach(w => {
        if (d[w] < 0) {
          Q.push(w);
          d[w] = d[v] + 1;
        }
        if (d[w] === d[v] + 1) {
          sigma[w] += sigma[v];
          P[w].push(v);
        }
      });
    }

    const delta: Record<string, number> = {};
    nodes.forEach(n => delta[n.id] = 0);
    while (stack.length > 0) {
      const w = stack.pop()!;
      P[w].forEach(v => {
        delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      });
      if (w !== s.id) {
        betweenness[w] += delta[w];
      }
    }
  });

  // Divide by 2 because paths are counted twice (u,v)
  nodes.forEach(n => betweenness[n.id] /= 2);

  // Closeness Centrality
  const closenessCentrality: Record<string, number> = {};
  nodes.forEach(uNode => {
    const startId = uNode.id;
    const dists: Record<string, number> = {};
    const queue: string[] = [startId];
    dists[startId] = 0;
    
    let sumD = 0;
    let countReachable = 0;
    
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const neighbors = adj[curr] || [];
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (dists[neighbor] === undefined) {
          dists[neighbor] = dists[curr] + 1;
          sumD += dists[neighbor];
          countReachable++;
          queue.push(neighbor);
        }
      }
    }
    
    closenessCentrality[startId] = sumD > 0 ? (countReachable / sumD) : 0;
  });

  // Country specific stats
  const countryStats = countries.map(country => {
    const countrySongs = songs.filter(s => s.country === country);
    const wins = countrySongs.filter(s => s.final_place === 1).length;
    const top3 = countrySongs.length;
    const nodeId = `country-${country}`;

    return {
      name: country,
      top3,
      wins,
      degree: degreeCentrality[nodeId] || 0,
      closeness: closenessCentrality[nodeId] || 0,
      betweenness: betweenness[nodeId] || 0
    };
  });

  return {
    nodes,
    links,
    degreeCentrality,
    betweenness,
    closeness: closenessCentrality,
    countryStats,
    factorCounts
  };
}

import React from 'react';

const nodes: [number, number][] = [
  [30, 22], [100, 8], [175, 28], [235, 12],
  [260, 68], [210, 72], [140, 55], [65, 75],
  [10, 105], [45, 138], [115, 118], [185, 128], [248, 148],
  [80, 195], [160, 178], [220, 192], [270, 210],
  [0, 62], [0, 175], [270, 42],
];

const edges: [number, number][] = [
  [0,1],[1,2],[2,3],
  [0,7],[1,6],[2,6],[2,5],[3,5],[3,4],
  [4,5],[5,11],[6,10],[7,9],
  [8,9],[8,7],
  [9,13],[10,13],[10,14],[11,14],[11,15],[12,15],[12,16],
  [0,6],[6,11],[9,10],[10,11],[11,12],
  [13,14],[14,15],
  [17,8],[17,0],[19,4],[18,13],[18,8],
];

export function NetworkBackground({ patternId, color = '#7A6650' }: { patternId: string; color?: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} x="0" y="0" width="270" height="220" patternUnits="userSpaceOnUse">
            {edges.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a][0]} y1={nodes[a][1]}
                x2={nodes[b][0]} y2={nodes[b][1]}
                stroke={color} strokeWidth="0.7" opacity="0.10"
              />
            ))}
            {nodes.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.8" fill={color} opacity="0.18" />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

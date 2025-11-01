import React, { useMemo } from 'react';

export default function DottedGridBackground({
  dotColor = 'rgba(0,0,0,0.12)',
  dotRadius = 1.5,
  spacing = 22,
  background = '#d7d7d7',
  opacity = 1,
  className = '',
  style = {},
  children,
}) {
  const patternId = useMemo(() => `dots-${Math.random().toString(36).slice(2, 9)}`, []);
  const center = spacing / 2;
  const patternSize = spacing;
  const viewBox = `0 0 ${patternSize} ${patternSize}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background, ...style,}}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        style={{ opacity, width: "100%", height: "100%", position: 'fixed', top: 0, left: 0, zIndex:-1,}}
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
            viewBox={viewBox}
          >
            <rect x="0" y="0" width={patternSize} height={patternSize} fill="transparent" />
            <circle cx={center} cy={center} r={dotRadius} fill={dotColor} />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className='container' style={{position: 'fixed', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1, width: '100%', height: '100%'}}>
        {children}
      </div>
    </div>
  );
}

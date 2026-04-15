import { useEffect, useRef } from 'react';
import './MeshGrid.css';

/**
 * MeshGrid — renders the √p × √p grid with animated shift transitions.
 *
 * Props:
 *   data        – current flat array of node data values
 *   n           – grid side length
 *   phase       – 'idle' | 'initial' | 'rowShift' | 'colShift' | 'done'
 *   rowShift    – number of positions shifted right per row
 *   colShift    – number of positions shifted down per column
 *   prevData    – data BEFORE the current phase (used for animation source)
 *   speed       – animation speed multiplier
 *   label       – label shown above the grid
 */
export default function MeshGrid({
  data,
  n,
  phase,
  rowShift = 0,
  colShift = 0,
  prevData,
  speed = 1,
  label = '',
  showArrows = false,
}) {
  const gridRef = useRef(null);
  const p = n * n;

  // Compute cell size based on grid size
  const cellSize = n <= 4 ? 72 : n <= 5 ? 64 : n <= 6 ? 56 : n <= 7 ? 50 : 44;
  const gap = n <= 4 ? 8 : n <= 5 ? 6 : 4;

  const gridWidth = n * cellSize + (n - 1) * gap;

  // Determine phase-specific classes
  const phaseClass =
    phase === 'rowShift'
      ? 'grid-row-shift'
      : phase === 'colShift'
        ? 'grid-col-shift'
        : phase === 'done'
          ? 'grid-done'
          : '';

  // Build arrow overlays for the current shift
  const arrows = [];
  if (showArrows && phase === 'rowShift' && rowShift > 0) {
    // Show horizontal arrows on each row
    for (let r = 0; r < n; r++) {
      arrows.push(
        <div
          key={`row-arrow-${r}`}
          className="shift-arrow row-arrow"
          style={{
            top: r * (cellSize + gap) + cellSize / 2 - 12,
            left: 0,
            width: gridWidth,
          }}
        >
          <div className="arrow-body">
            <span className="arrow-label">+{rowShift}</span>
            <span className="arrow-head">→</span>
          </div>
        </div>
      );
    }
  }

  if (showArrows && phase === 'colShift' && colShift > 0) {
    // Show vertical arrows on each column
    for (let c = 0; c < n; c++) {
      arrows.push(
        <div
          key={`col-arrow-${c}`}
          className="shift-arrow col-arrow"
          style={{
            left: c * (cellSize + gap) + cellSize / 2 - 12,
            top: 0,
            height: n * (cellSize + gap) - gap,
          }}
        >
          <div className="arrow-body-v">
            <span className="arrow-label">+{colShift}</span>
            <span className="arrow-head">↓</span>
          </div>
        </div>
      );
    }
  }

  // Compute animation offset for cells
  function getCellStyle(idx) {
    const r = Math.floor(idx / n);
    const c = idx % n;
    const base = {
      width: cellSize,
      height: cellSize,
      animationDuration: `${0.8 / speed}s`,
    };

    if (phase === 'rowShift' && prevData) {
      // Animate slide from old position to new position (row shift)
      const shiftPx = rowShift * (cellSize + gap);
      return {
        ...base,
        '--shift-x': `${-shiftPx}px`,
        animation: `slideFromLeft ${0.8 / speed}s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
      };
    }

    if (phase === 'colShift' && prevData) {
      const shiftPx = colShift * (cellSize + gap);
      return {
        ...base,
        '--shift-y': `${-shiftPx}px`,
        animation: `slideFromTop ${0.8 / speed}s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
      };
    }

    return base;
  }

  // Phase color scheme
  function getCellClass(idx) {
    let cls = 'grid-cell';
    if (phase === 'rowShift') cls += ' cell-row-shift';
    else if (phase === 'colShift') cls += ' cell-col-shift';
    else if (phase === 'done') cls += ' cell-done';
    else cls += ' cell-initial';
    return cls;
  }

  return (
    <div className={`mesh-grid-container ${phaseClass}`}>
      {label && (
        <div className="grid-label">
          <span className="grid-label-text">{label}</span>
        </div>
      )}
      <div
        className="mesh-grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${n}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: p }).map((_, idx) => (
          <div key={idx} className={getCellClass(idx)} style={getCellStyle(idx)}>
            <span className="cell-index">N{idx}</span>
            <span className="cell-value">{data[idx] !== undefined ? data[idx] : '–'}</span>
          </div>
        ))}
        {arrows}
      </div>
    </div>
  );
}

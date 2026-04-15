import { useState, useRef, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import MeshGrid from './components/MeshGrid';
import ComplexityPanel from './components/ComplexityPanel';
import { computeShift } from './utils/shiftLogic';
import './App.css';

export default function App() {
  const [p, setP] = useState(null);
  const [q, setQ] = useState(null);
  const [n, setN] = useState(4);
  const [shiftResult, setShiftResult] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [displayData, setDisplayData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const addTimeout = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const handleStart = useCallback(
    (pVal, qVal) => {
      clearTimeouts();
      setIsAnimating(true);

      const result = computeShift(pVal, qVal);
      setP(pVal);
      setQ(qVal);
      setN(result.n);
      setShiftResult(result);

      const baseDuration = 1200;
      const duration = baseDuration / speed;

      // Phase 1: Show initial state
      setPhase('initial');
      setDisplayData(result.initial);
      setPrevData(null);

      // Phase 2: Row shift
      addTimeout(() => {
        setPrevData(result.initial);
        setDisplayData(result.afterRow);
        setPhase('rowShift');
      }, duration);

      // Phase 3: Column shift
      addTimeout(() => {
        setPrevData(result.afterRow);
        setDisplayData(result.afterCol);
        setPhase('colShift');
      }, duration * 2);

      // Phase 4: Done
      addTimeout(() => {
        setPhase('done');
        setPrevData(null);
        setIsAnimating(false);
      }, duration * 3);
    },
    [speed]
  );

  const handleReset = useCallback(() => {
    clearTimeouts();
    setPhase('idle');
    setDisplayData(null);
    setPrevData(null);
    setShiftResult(null);
    setIsAnimating(false);
    setP(null);
    setQ(null);
  }, []);

  function getPhaseLabel() {
    switch (phase) {
      case 'initial':
        return 'Initial State';
      case 'rowShift':
        return `Stage 1 — Row Shift (+${shiftResult?.rowShift || 0})`;
      case 'colShift':
        return `Stage 2 — Column Shift (+${shiftResult?.colShift || 0})`;
      case 'done':
        return 'Final State (Shift Complete)';
      default:
        return '';
    }
  }

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      {/* Header */}
      <header className="app-header">
        <div className="header-badge">PDC Assignment</div>
        <h1>
          <span className="title-mesh">Mesh</span> Circular Shift{' '}
          <span className="title-viz">Visualizer</span>
        </h1>
        <p className="subtitle">
          Interactive 2D mesh topology simulation — circular <em>q</em>-shift in two stages
        </p>
      </header>

      <main className="app-main">
        {/* Left sidebar: controls */}
        <aside className="sidebar sidebar-left">
          <ControlPanel
            onStart={handleStart}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            isAnimating={isAnimating}
            animationPhase={phase}
          />
        </aside>

        {/* Center: grid visualization */}
        <section className="grid-area">
          {phase === 'idle' ? (
            <div className="placeholder-card">
              <div className="placeholder-icon">🔲</div>
              <h2>Configure &amp; Run</h2>
              <p>
                Set the number of nodes <strong>p</strong> and shift amount <strong>q</strong> in
                the control panel, then click <strong>Start Shift</strong>.
              </p>
              <div className="placeholder-steps">
                <div className="step-item">
                  <span className="step-num">1</span>
                  <span>Choose p and q</span>
                </div>
                <div className="step-item">
                  <span className="step-num">2</span>
                  <span>Watch Stage 1 (Row Shift)</span>
                </div>
                <div className="step-item">
                  <span className="step-num">3</span>
                  <span>Watch Stage 2 (Column Shift)</span>
                </div>
                <div className="step-item">
                  <span className="step-num">4</span>
                  <span>Compare Mesh vs Ring</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid-display">
              {/* Current animated grid */}
              <MeshGrid
                data={displayData}
                n={n}
                phase={phase}
                rowShift={shiftResult?.rowShift || 0}
                colShift={shiftResult?.colShift || 0}
                prevData={prevData}
                speed={speed}
                label={getPhaseLabel()}
                showArrows={phase === 'rowShift' || phase === 'colShift'}
              />

              {/* Before/After comparison shown after completion */}
              {phase === 'done' && shiftResult && (
                <div className="before-after-section">
                  <h3 className="section-title">Before / After Comparison</h3>
                  <div className="before-after-grids">
                    <MeshGrid
                      data={shiftResult.initial}
                      n={n}
                      phase="idle"
                      label="Initial State"
                    />
                    <div className="stage-arrow">
                      <span>Row +{shiftResult.rowShift}</span>
                      <span className="big-arrow">→</span>
                    </div>
                    <MeshGrid
                      data={shiftResult.afterRow}
                      n={n}
                      phase="idle"
                      label="After Stage 1"
                    />
                    <div className="stage-arrow">
                      <span>Col +{shiftResult.colShift}</span>
                      <span className="big-arrow">→</span>
                    </div>
                    <MeshGrid
                      data={shiftResult.afterCol}
                      n={n}
                      phase="idle"
                      label="Final State"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right sidebar: complexity */}
        <aside className="sidebar sidebar-right">
          <ComplexityPanel p={p} q={q} />
        </aside>
      </main>

      <footer className="app-footer">
        <p>Mesh Circular Shift Visualizer — Parallel &amp; Distributed Computing</p>
      </footer>
    </div>
  );
}

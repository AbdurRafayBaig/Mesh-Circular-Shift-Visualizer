import { useState, useEffect } from 'react';
import { isPerfectSquare } from '../utils/shiftLogic';
import './ControlPanel.css';

const VALID_P = [4, 9, 16, 25, 36, 49, 64];

export default function ControlPanel({ onStart, onReset, onSpeedChange, isAnimating, animationPhase }) {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    onSpeedChange(speed);
  }, [speed]);

  function validate(pVal, qVal) {
    const errs = {};
    const pNum = Number(pVal);
    const qNum = Number(qVal);

    if (!pNum || pNum < 4 || pNum > 64) {
      errs.p = 'p must be between 4 and 64';
    } else if (!isPerfectSquare(pNum)) {
      errs.p = 'p must be a perfect square (4, 9, 16, 25, 36, 49, 64)';
    }

    if (!qNum || qNum < 1) {
      errs.q = 'q must be at least 1';
    } else if (pNum && qNum >= pNum) {
      errs.q = `q must be less than p (< ${pNum})`;
    }

    return errs;
  }

  function handleStart() {
    const errs = validate(p, q);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onStart(Number(p), Number(q));
    }
  }

  function handlePChange(val) {
    setP(val);
    if (Object.keys(errors).length > 0) {
      setErrors(validate(val, q));
    }
  }

  function handleQChange(val) {
    setQ(val);
    if (Object.keys(errors).length > 0) {
      setErrors(validate(p, val));
    }
  }

  const phaseLabels = {
    idle: 'Ready',
    initial: 'Showing Initial State',
    rowShift: 'Stage 1 — Row Shift',
    colShift: 'Stage 2 — Column Shift',
    done: 'Shift Complete ✓',
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <div className="panel-icon">⚙️</div>
        <h2>Control Panel</h2>
      </div>

      <div className="input-group">
        <label htmlFor="input-p">
          <span className="label-text">Nodes (p)</span>
          <span className="label-hint">Perfect square, 4–64</span>
        </label>
        <select
          id="input-p"
          value={p}
          onChange={(e) => handlePChange(e.target.value)}
          disabled={isAnimating}
          className={errors.p ? 'input-error' : ''}
        >
          {VALID_P.map((v) => (
            <option key={v} value={v}>
              {v} ({Math.sqrt(v)}×{Math.sqrt(v)} mesh)
            </option>
          ))}
        </select>
        {errors.p && <span className="error-msg">{errors.p}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="input-q">
          <span className="label-text">Shift (q)</span>
          <span className="label-hint">1 to {p - 1}</span>
        </label>
        <input
          id="input-q"
          type="number"
          min={1}
          max={p - 1}
          value={q}
          onChange={(e) => handleQChange(e.target.value)}
          disabled={isAnimating}
          className={errors.q ? 'input-error' : ''}
        />
        {errors.q && <span className="error-msg">{errors.q}</span>}
      </div>

      <div className="input-group">
        <label htmlFor="speed-slider">
          <span className="label-text">Speed</span>
          <span className="label-hint">{speed.toFixed(1)}×</span>
        </label>
        <input
          id="speed-slider"
          type="range"
          min={0.5}
          max={3}
          step={0.5}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-slider"
        />
        <div className="speed-ticks">
          <span>0.5×</span>
          <span>1×</span>
          <span>1.5×</span>
          <span>2×</span>
          <span>2.5×</span>
          <span>3×</span>
        </div>
      </div>

      <div className="button-row">
        <button
          id="btn-start"
          className="btn btn-primary"
          onClick={handleStart}
          disabled={isAnimating}
        >
          <span className="btn-icon">▶</span>
          {animationPhase === 'done' ? 'Run Again' : 'Start Shift'}
        </button>
        <button
          id="btn-reset"
          className="btn btn-secondary"
          onClick={onReset}
          disabled={animationPhase === 'idle'}
        >
          <span className="btn-icon">↺</span>
          Reset
        </button>
      </div>

      <div className={`phase-indicator phase-${animationPhase}`}>
        <div className="phase-dot" />
        <span>{phaseLabels[animationPhase] || 'Ready'}</span>
      </div>
    </div>
  );
}

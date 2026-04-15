import { computeComplexity } from '../utils/shiftLogic';
import './ComplexityPanel.css';

export default function ComplexityPanel({ p, q }) {
  if (!p || !q) {
    return (
      <div className="complexity-panel">
        <div className="panel-header">
          <div className="panel-icon">📊</div>
          <h2>Complexity Analysis</h2>
        </div>
        <p className="empty-state">Enter p and q, then run a shift to see the analysis.</p>
      </div>
    );
  }

  const { rowShiftAmount, colShiftAmount, meshSteps, ringSteps, n } = computeComplexity(p, q);
  const meshWins = meshSteps <= ringSteps;
  const savings = ringSteps - meshSteps;
  const savingsPercent = ringSteps > 0 ? ((savings / ringSteps) * 100).toFixed(0) : 0;

  // Bar chart scale
  const maxSteps = Math.max(meshSteps, ringSteps, 1);

  return (
    <div className="complexity-panel">
      <div className="panel-header">
        <div className="panel-icon">📊</div>
        <h2>Complexity Analysis</h2>
      </div>

      {/* Shift decomposition */}
      <div className="decomposition">
        <div className="decomp-item">
          <span className="decomp-label">Row Shift</span>
          <span className="decomp-formula">q mod √p = {q} mod {n}</span>
          <span className="decomp-value amber">{rowShiftAmount}</span>
        </div>
        <div className="decomp-item">
          <span className="decomp-label">Col Shift</span>
          <span className="decomp-formula">⌊q / √p⌋ = ⌊{q} / {n}⌋</span>
          <span className="decomp-value violet">{colShiftAmount}</span>
        </div>
      </div>

      {/* Formulas */}
      <div className="formulas-section">
        <h3>Step Count Formulas</h3>
        <div className="formula-card">
          <div className="formula-name">Mesh Steps</div>
          <div className="formula-expr">(q mod √p) + ⌊q / √p⌋</div>
          <div className="formula-result mesh-color">= {rowShiftAmount} + {colShiftAmount} = <strong>{meshSteps}</strong></div>
        </div>
        <div className="formula-card">
          <div className="formula-name">Ring Steps</div>
          <div className="formula-expr">min(q, p − q)</div>
          <div className="formula-result ring-color">= min({q}, {p - q}) = <strong>{ringSteps}</strong></div>
        </div>
      </div>

      {/* Bar chart comparison */}
      <div className="bar-chart-section">
        <h3>Mesh vs Ring Comparison</h3>
        <div className="bar-chart">
          <div className="bar-row">
            <span className="bar-label">Mesh</span>
            <div className="bar-track">
              <div
                className="bar-fill mesh-bar"
                style={{ width: `${(meshSteps / maxSteps) * 100}%` }}
              >
                <span className="bar-value">{meshSteps} steps</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <span className="bar-label">Ring</span>
            <div className="bar-track">
              <div
                className="bar-fill ring-bar"
                style={{ width: `${(ringSteps / maxSteps) * 100}%` }}
              >
                <span className="bar-value">{ringSteps} steps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`verdict ${meshWins ? 'verdict-win' : 'verdict-loss'}`}>
        {meshWins ? (
          <>
            <span className="verdict-icon">🏆</span>
            <div>
              <strong>Mesh is more efficient!</strong>
              <p>
                Saves {savings} step{savings !== 1 ? 's' : ''} ({savingsPercent}% fewer
                communications)
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="verdict-icon">⚡</span>
            <div>
              <strong>Ring is more efficient here</strong>
              <p>Ring uses {meshSteps - ringSteps} fewer step(s) for this configuration</p>
            </div>
          </>
        )}
      </div>

      {/* Comparison table for reference values */}
      <div className="ref-table-section">
        <h3>Reference Table</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>p</th>
              <th>q</th>
              <th>Mesh Steps</th>
              <th>Ring Steps</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {[
              [16, 3],
              [16, 5],
              [16, 7],
              [64, 3],
              [64, 5],
              [64, 7],
            ].map(([rp, rq]) => {
              const rc = computeComplexity(rp, rq);
              const w = rc.meshSteps <= rc.ringSteps;
              return (
                <tr key={`${rp}-${rq}`} className={rp === p && rq === q ? 'active-row' : ''}>
                  <td>{rp}</td>
                  <td>{rq}</td>
                  <td className="mesh-color">{rc.meshSteps}</td>
                  <td className="ring-color">{rc.ringSteps}</td>
                  <td>{w ? '🟢 Mesh' : '🔴 Ring'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

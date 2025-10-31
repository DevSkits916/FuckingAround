import { ContrastResult } from '../types';

interface ContrastBadgeProps {
  results: ContrastResult[];
}

export function ContrastBadge({ results }: ContrastBadgeProps) {
  return (
    <div className="panel-card">
      <h2>Contrast</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {results.map((result) => (
          <div key={result.id} className="badge" style={{ background: result.meetsAA ? 'rgba(34,197,94,0.2)' : 'rgba(248,113,113,0.2)' }}>
            <span>{result.id.toUpperCase()}</span>
            <strong>{result.ratio}:1</strong>
            <span>{result.meetsAA ? 'AA Pass' : 'Needs attention'}</span>
            {result.recommendation && (
              <span style={{ opacity: 0.7 }}>• {result.recommendation}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

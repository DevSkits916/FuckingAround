import { EmailLintWarning } from '../types';

interface LinkWarningsProps {
  warnings: EmailLintWarning[];
}

export function LinkWarnings({ warnings }: LinkWarningsProps) {
  if (!warnings.length) {
    return (
      <div className="panel-card">
        <h2>Email Checks</h2>
        <div className="badge" style={{ background: 'rgba(34,197,94,0.2)' }}>
          All checks passed
        </div>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <h2>Email Checks</h2>
      <ul className="warning-list">
        {warnings.map((warning) => (
          <li key={warning.id} className="warning-card">
            <strong>{warning.message}</strong>
            {warning.fix && <div style={{ fontSize: 12, marginTop: 4 }}>{warning.fix}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

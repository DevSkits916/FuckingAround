import React, { useMemo } from 'react';
import {
  renderProfileToTableHtml,
  lintEmailHtml,
  auditContrast,
  HtmlLintIssue,
} from '@smart-signature/shared';
import { useActiveProfile } from '../store/useProfilesStore';

export const Preview: React.FC = () => {
  const profile = useActiveProfile();
  const html = useMemo(() => (profile ? renderProfileToTableHtml(profile) : ''), [profile]);
  const lint = useMemo<HtmlLintIssue[]>(() => (html ? lintEmailHtml(html) : []), [html]);
  const contrast = useMemo<HtmlLintIssue[]>(() => (html ? auditContrast(html) : []), [html]);

  if (!profile) return null;

  return (
    <section className="preview" data-testid="preview">
      <h3>Preview</h3>
      <iframe title="Signature preview" srcDoc={html} />
      <div className="lint-results">
        <h4>Lint</h4>
        <ul>
          {lint.map((issue) => (
            <li key={issue.id} className={issue.severity}>
              {issue.message}
            </li>
          ))}
          {contrast.map((issue) => (
            <li key={issue.id} className={issue.severity}>
              {issue.message}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Preview;

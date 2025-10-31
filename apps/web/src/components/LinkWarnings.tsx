import React from 'react';

interface LinkWarningsProps {
  issues: { message: string; severity: string }[];
}

export const LinkWarnings: React.FC<LinkWarningsProps> = ({ issues }) => (
  <ul className="link-warnings">
    {issues.map((issue, index) => (
      <li key={index} className={issue.severity}>
        {issue.message}
      </li>
    ))}
  </ul>
);

export default LinkWarnings;

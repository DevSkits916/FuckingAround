interface PreviewProps {
  html: string;
}

export function Preview({ html }: PreviewProps) {
  return (
    <div className="preview-wrapper">
      <div className="preview-frame" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

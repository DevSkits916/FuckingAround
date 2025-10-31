import { MouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { nanoid } from 'nanoid';
import { useSignatureStore } from '../store/useSignatureStore';
import { SignatureElement } from '../types';

function describeSpacing(node: SignatureElement) {
  const margin = node.margin ?? {};
  const padding = node.padding ?? {};
  return `Margin: ${margin.top ?? 0}/${margin.right ?? 0}/${margin.bottom ?? 0}/${margin.left ?? 0} • Padding: ${padding.top ?? 0}/${padding.right ?? 0}/${padding.bottom ?? 0}/${padding.left ?? 0}`;
}

export function Canvas() {
  const state = useSignatureStore((store) => store.state);
  const addNode = useSignatureStore((store) => store.addNode);
  const toggleSelection = useSignatureStore((store) => store.toggleSelection);
  const clearSelection = useSignatureStore((store) => store.clearSelection);
  const toggleLock = useSignatureStore((store) => store.toggleLock);
  const deleteSelected = useSignatureStore((store) => store.deleteSelected);
  const duplicateSelected = useSignatureStore((store) => store.duplicateSelected);

  const handleCanvasClick = () => {
    if (state.readOnlyPreview) return;
    clearSelection();
  };

  const addTextNode = () => {
    const node: SignatureElement = {
      id: nanoid(),
      type: 'text',
      text: 'New text block',
      x: 48,
      y: 48,
    };
    addNode(node);
  };

  const addCustomBlock = () => {
    addNode({
      id: nanoid(),
      type: 'customHtml',
      x: 60,
      y: 60,
      html: '<div>Custom HTML</div>',
    });
  };

  const handleNodeClick = (event: MouseEvent<HTMLDivElement>, id: string) => {
    event.stopPropagation();
    if (state.readOnlyPreview) return;
    toggleSelection(id);
  };

  const handleKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (state.readOnlyPreview) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteSelected();
    }
    if ((event.key === 'd' && event.metaKey) || (event.key === 'd' && event.ctrlKey)) {
      event.preventDefault();
      duplicateSelected();
    }
  };

  return (
    <div className="panel-card" style={{ height: '100%' }}>
      <div className="toolbar" style={{ marginBottom: 12 }}>
        <button type="button" onClick={addTextNode} disabled={state.readOnlyPreview}>
          Add Text
        </button>
        <button type="button" onClick={addCustomBlock} disabled={state.readOnlyPreview}>
          Add Custom HTML
        </button>
        <button type="button" onClick={deleteSelected} disabled={!state.selectedIds.length}>
          Delete Selected
        </button>
        <button type="button" onClick={duplicateSelected} disabled={!state.selectedIds.length}>
          Duplicate
        </button>
      </div>
      <div
        className="canvas-board"
        tabIndex={0}
        onKeyDown={handleKey}
        onClick={handleCanvasClick}
        style={{ outline: 'none' }}
      >
        {state.showGrid && <div className="grid" />}
        <div className="canvas-content">
          {state.nodes.map((node) => (
            <div
              key={node.id}
              className={`canvas-node ${state.selectedIds.includes(node.id) ? 'selected' : ''}`}
              style={{
                top: node.y,
                left: node.x,
                pointerEvents: state.readOnlyPreview ? 'none' : 'auto',
              }}
              onClick={(event) => handleNodeClick(event, node.id)}
            >
              {node.type === 'text' && <div>{node.text}</div>}
              {node.type === 'customHtml' && (
                <div dangerouslySetInnerHTML={{ __html: node.html }} />
              )}
              {node.type === 'image' && (
                <img
                  src={node.dataUri}
                  alt={node.alt}
                  style={{ maxWidth: node.maxWidth ?? 200, display: 'block' }}
                />
              )}
              {node.type === 'divider' && (
                <div
                  style={{
                    width: node.direction === 'horizontal' ? node.length : 1,
                    height: node.direction === 'horizontal' ? 1 : node.length,
                    background: node.color,
                  }}
                />
              )}
              {node.type === 'group' && <div>Group container ({node.layout})</div>}
              {state.spacingInspector && state.selectedIds.includes(node.id) && (
                <div className="shortcut-label" style={{ marginTop: 8 }}>
                  {describeSpacing(node)}
                </div>
              )}
              <div className="toolbar" style={{ marginTop: 8 }}>
                <button type="button" onClick={() => toggleLock(node.id)}>
                  {node.locked ? 'Unlock' : 'Lock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

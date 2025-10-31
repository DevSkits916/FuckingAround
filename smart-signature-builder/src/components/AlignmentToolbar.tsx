import { useCallback } from 'react';
import { useSignatureStore } from '../store/useSignatureStore';

export function AlignmentToolbar() {
  const setState = useSignatureStore((store) => store.setState);
  const state = useSignatureStore((store) => store.state);
  const groupSelected = useSignatureStore((store) => store.groupSelected);
  const ungroupSelected = useSignatureStore((store) => store.ungroupSelected);
  const nudgeSelected = useSignatureStore((store) => store.nudgeSelected);

  const align = useCallback(
    (direction: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle') => {
      setState((draft) => {
        const selected = draft.nodes.filter((node) => draft.selectedIds.includes(node.id));
        if (selected.length < 2) return;
        const xs = selected.map((node) => node.x);
        const ys = selected.map((node) => node.y);
        const targetX = direction === 'left' ? Math.min(...xs) : direction === 'right' ? Math.max(...xs) : Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
        const targetY = direction === 'top' ? Math.min(...ys) : direction === 'bottom' ? Math.max(...ys) : Math.round(ys.reduce((a, b) => a + b, 0) / ys.length);
        selected.forEach((node) => {
          if (direction === 'left' || direction === 'right' || direction === 'center') {
            node.x = targetX;
          }
          if (direction === 'top' || direction === 'bottom' || direction === 'middle') {
            node.y = targetY;
          }
        });
      });
    },
    [setState],
  );

  const canAlign = state.selectedIds.length >= 2;

  return (
    <div className="panel-card">
      <h2>Alignment</h2>
      <div className="toolbar" style={{ flexWrap: 'wrap' }}>
        <button type="button" onClick={() => align('left')} disabled={!canAlign}>
          Align Left
        </button>
        <button type="button" onClick={() => align('center')} disabled={!canAlign}>
          Align Center
        </button>
        <button type="button" onClick={() => align('right')} disabled={!canAlign}>
          Align Right
        </button>
        <button type="button" onClick={() => align('top')} disabled={!canAlign}>
          Align Top
        </button>
        <button type="button" onClick={() => align('middle')} disabled={!canAlign}>
          Align Middle
        </button>
        <button type="button" onClick={() => align('bottom')} disabled={!canAlign}>
          Align Bottom
        </button>
        <button type="button" onClick={groupSelected} disabled={state.selectedIds.length < 2}>
          Group
        </button>
        <button type="button" onClick={ungroupSelected} disabled={!state.selectedIds.length}>
          Ungroup
        </button>
        <button type="button" onClick={() => nudgeSelected(-1, 0)} disabled={!state.selectedIds.length}>
          ◀︎
        </button>
        <button type="button" onClick={() => nudgeSelected(1, 0)} disabled={!state.selectedIds.length}>
          ▶︎
        </button>
        <button type="button" onClick={() => nudgeSelected(0, -1)} disabled={!state.selectedIds.length}>
          ▲
        </button>
        <button type="button" onClick={() => nudgeSelected(0, 1)} disabled={!state.selectedIds.length}>
          ▼
        </button>
      </div>
    </div>
  );
}

import { UndoRedoState } from '../types';

type Updater<T> = (current: T) => T;

export interface HistoryManager<T> {
  state: UndoRedoState<T>;
  push: (snapshot: T) => HistoryManager<T>;
  undo: (current: T) => { history: HistoryManager<T>; value: T | null };
  redo: (current: T) => { history: HistoryManager<T>; value: T | null };
  clearFuture: () => HistoryManager<T>;
}

export function createHistory<T>(limit = 50): HistoryManager<T> {
  const initial: UndoRedoState<T> = {
    past: [],
    future: [],
    limit,
  };

  const history: HistoryManager<T> = {
    state: initial,
    push(snapshot) {
      const nextPast = [...history.state.past, snapshot];
      if (nextPast.length > history.state.limit) {
        nextPast.shift();
      }
      history.state = {
        past: nextPast,
        future: [],
        limit: history.state.limit,
      };
      return history;
    },
    undo(current) {
      const past = [...history.state.past];
      if (!past.length) {
        return { history, value: null };
      }
      const previous = past[past.length - 1];
      past.pop();
      history.state = {
        past,
        future: [current, ...history.state.future],
        limit: history.state.limit,
      };
      return { history, value: previous };
    },
    redo(current) {
      const future = [...history.state.future];
      if (!future.length) {
        return { history, value: null };
      }
      const next = future[0];
      future.shift();
      history.state = {
        past: [...history.state.past, current],
        future,
        limit: history.state.limit,
      };
      return { history, value: next };
    },
    clearFuture() {
      history.state = {
        past: [...history.state.past],
        future: [],
        limit: history.state.limit,
      };
      return history;
    },
  };

  return history;
}

export function applyHistoryUpdate<T>(
  manager: HistoryManager<T>,
  updater: Updater<T>,
  current: T,
) {
  const next = updater(current);
  manager.push(current);
  manager.clearFuture();
  return next;
}

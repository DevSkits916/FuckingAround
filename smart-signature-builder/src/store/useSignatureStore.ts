import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import {
  SignatureState,
  SignatureElement,
  SignatureIdentity,
  ThemeTokens,
  SocialLink,
  CustomField,
} from '../types';
import { createHistory } from './history';

const STORAGE_KEY = 'smartSignature.v2';
const SCHEMA_VERSION = '2.0.0';

function createDefaultTheme(): ThemeTokens {
  return {
    baseFont: 'sans',
    baseFontSize: 14,
    lineHeight: 1.4,
    primary: '#0a84ff',
    text: '#1f2933',
    subtleText: '#52606d',
    divider: '#d9e2ec',
    background: '#ffffff',
  };
}

function createDefaultIdentity(): SignatureIdentity {
  return {
    name: 'Alex Lee',
    title: 'Director of Product',
    tagline: 'Helping teams build email trust',
    pronouns: 'they/them',
    phone: '+1 (555) 123-4567',
    secondaryPhone: '+1 (555) 987-6543',
    email: 'alex@example.com',
    website: 'https://example.com',
    address: '123 Market Street, Suite 200, San Francisco, CA',
  };
}

function createDefaultNodes(): SignatureElement[] {
  const groupId = nanoid();
  return [
    {
      id: groupId,
      type: 'group',
      layout: 'row',
      x: 0,
      y: 0,
      gap: 16,
      children: [],
      padding: { top: 12, bottom: 12, left: 12, right: 12 },
      backgroundColor: '#ffffff',
    },
  ];
}

function createDefaultState(): SignatureState {
  return {
    version: SCHEMA_VERSION,
    identity: createDefaultIdentity(),
    social: [],
    customFields: [],
    theme: createDefaultTheme(),
    nodes: createDefaultNodes(),
    selectedIds: [],
    showGrid: true,
    snapToGrid: true,
    snapToAlignment: true,
    spacingInspector: true,
    readOnlyPreview: false,
    watermark: { text: '', enabled: false },
    terminalTheme: false,
  };
}

export interface SignatureStore {
  state: SignatureState;
  setState: (
    updater: (draft: SignatureState) => void,
    options?: { skipHistory?: boolean },
  ) => void;
  replaceState: (next: SignatureState, options?: { skipHistory?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  select: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  addNode: (node: SignatureElement) => void;
  updateNode: (id: string, updater: (node: SignatureElement) => SignatureElement) => void;
  removeNode: (id: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  nudgeSelected: (dx: number, dy: number) => void;
  toggleLock: (id: string) => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  toggleReadOnly: () => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  toggleAlignmentGuides: () => void;
  toggleSpacingInspector: () => void;
  setWatermark: (text: string, enabled: boolean) => void;
  setTerminalTheme: (enabled: boolean) => void;
  addSocial: (link: Partial<SocialLink>) => void;
  updateSocial: (id: string, updater: (link: SocialLink) => SocialLink) => void;
  removeSocial: (id: string) => void;
  addCustomField: () => void;
  updateCustomField: (
    id: string,
    updater: (field: CustomField) => CustomField,
  ) => void;
  removeCustomField: (id: string) => void;
  loadFromStorage: () => void;
}

interface PersistedShape {
  state: SignatureState;
}

export const useSignatureStore = create<SignatureStore>()(
  persist(
    (set, get) => {
      const history = createHistory<SignatureState>(50);

      const pushHistory = (snapshot: SignatureState) => {
        history.push(snapshot);
      };

      const applyUpdate = (
        updater: (draft: SignatureState) => void,
        options?: { skipHistory?: boolean },
      ) => {
        set((store) => {
          const current = store.state;
          const next = produce(current, updater);
          if (options?.skipHistory) {
            return { ...store, state: next };
          }
          pushHistory(current);
          history.clearFuture();
          return { ...store, state: next };
        });
      };

      const replaceState = (
        next: SignatureState,
        options?: { skipHistory?: boolean },
      ) => {
        set((store) => {
          if (!options?.skipHistory) {
            pushHistory(store.state);
            history.clearFuture();
          }
          return { ...store, state: next };
        });
      };

      return {
        state: createDefaultState(),
        setState: applyUpdate,
        replaceState,
        undo: () => {
          set((store) => {
            const { value } = history.undo(store.state);
            if (value) {
              return { ...store, state: value };
            }
            return store;
          });
        },
        redo: () => {
          set((store) => {
            const { value } = history.redo(store.state);
            if (value) {
              return { ...store, state: value };
            }
            return store;
          });
        },
        reset: () => {
          const defaults = createDefaultState();
          set({ state: defaults });
          history.state = { past: [], future: [], limit: history.state.limit };
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
          }
        },
        select: (ids) => {
          applyUpdate((draft) => {
            draft.selectedIds = ids;
          }, { skipHistory: true });
        },
        toggleSelection: (id) => {
          applyUpdate((draft) => {
            if (draft.selectedIds.includes(id)) {
              draft.selectedIds = draft.selectedIds.filter((current) => current !== id);
            } else {
              draft.selectedIds = [...draft.selectedIds, id];
            }
          }, { skipHistory: true });
        },
        clearSelection: () => {
          applyUpdate((draft) => {
            draft.selectedIds = [];
          }, { skipHistory: true });
        },
        addNode: (node) => {
          applyUpdate((draft) => {
            draft.nodes.push(node);
            draft.selectedIds = [node.id];
          });
        },
        updateNode: (id, updater) => {
          applyUpdate((draft) => {
            draft.nodes = draft.nodes.map((node) =>
              node.id === id ? updater(node) : node,
            );
          });
        },
        removeNode: (id) => {
          applyUpdate((draft) => {
            draft.nodes = draft.nodes.filter((node) => node.id !== id);
            draft.selectedIds = draft.selectedIds.filter((current) => current !== id);
          });
        },
        deleteSelected: () => {
          applyUpdate((draft) => {
            draft.nodes = draft.nodes.filter(
              (node) => !draft.selectedIds.includes(node.id),
            );
            draft.selectedIds = [];
          });
        },
        duplicateSelected: () => {
          applyUpdate((draft) => {
            const duplicates: SignatureElement[] = draft.nodes
              .filter((node) => draft.selectedIds.includes(node.id))
              .map((node) => ({
                ...node,
                id: nanoid(),
                x: node.x + 12,
                y: node.y + 12,
              }));
            draft.nodes.push(...duplicates);
            draft.selectedIds = duplicates.map((node) => node.id);
          });
        },
        groupSelected: () => {
          applyUpdate((draft) => {
            if (draft.selectedIds.length < 2) return;
            const groupId = nanoid();
            draft.nodes.push({
              id: groupId,
              type: 'group',
              layout: 'row',
              x: 32,
              y: 32,
              children: [...draft.selectedIds],
              gap: 16,
            });
            draft.selectedIds.forEach((id) => {
              draft.nodes = draft.nodes.map((node) =>
                node.id === id ? { ...node, parentId: groupId } : node,
              );
            });
            draft.selectedIds = [groupId];
          });
        },
        ungroupSelected: () => {
          applyUpdate((draft) => {
            const groupIds = draft.selectedIds.filter((id) =>
              draft.nodes.find((node) => node.id === id && node.type === 'group'),
            );
            if (!groupIds.length) return;
            draft.nodes = draft.nodes
              .map((node) => {
                if (groupIds.includes(node.id) && node.type === 'group') {
                  return null;
                }
                if (node.parentId && groupIds.includes(node.parentId)) {
                  const clone = { ...node };
                  delete clone.parentId;
                  return clone;
                }
                return node;
              })
              .filter((node): node is SignatureElement => Boolean(node));
            draft.selectedIds = [];
          });
        },
        nudgeSelected: (dx, dy) => {
          applyUpdate((draft) => {
            draft.nodes = draft.nodes.map((node) =>
              draft.selectedIds.includes(node.id)
                ? { ...node, x: node.x + dx, y: node.y + dy }
                : node,
            );
          });
        },
        toggleLock: (id) => {
          applyUpdate((draft) => {
            draft.nodes = draft.nodes.map((node) =>
              node.id === id ? { ...node, locked: !node.locked } : node,
            );
          });
        },
        toggleReadOnly: () => {
          applyUpdate((draft) => {
            draft.readOnlyPreview = !draft.readOnlyPreview;
          }, { skipHistory: true });
        },
        toggleGrid: () => {
          applyUpdate((draft) => {
            draft.showGrid = !draft.showGrid;
          }, { skipHistory: true });
        },
        toggleSnap: () => {
          applyUpdate((draft) => {
            draft.snapToGrid = !draft.snapToGrid;
          }, { skipHistory: true });
        },
        toggleAlignmentGuides: () => {
          applyUpdate((draft) => {
            draft.snapToAlignment = !draft.snapToAlignment;
          }, { skipHistory: true });
        },
        toggleSpacingInspector: () => {
          applyUpdate((draft) => {
            draft.spacingInspector = !draft.spacingInspector;
          }, { skipHistory: true });
        },
        setWatermark: (text, enabled) => {
          applyUpdate((draft) => {
            draft.watermark = { text, enabled };
          });
        },
        setTerminalTheme: (enabled) => {
          applyUpdate((draft) => {
            draft.terminalTheme = enabled;
          });
        },
        addSocial: (partial) => {
          applyUpdate((draft) => {
            const link: SocialLink = {
              id: nanoid(),
              label: partial.label ?? 'Social',
              platform: partial.platform ?? 'custom',
              url: partial.url ?? '',
              username: partial.username ?? '',
              icon: partial.icon,
              customIconDataUri: partial.customIconDataUri,
            };
            draft.social.push(link);
          });
        },
        updateSocial: (id, updater) => {
          applyUpdate((draft) => {
            draft.social = draft.social.map((link) =>
              link.id === id ? updater(link) : link,
            );
          });
        },
        removeSocial: (id) => {
          applyUpdate((draft) => {
            draft.social = draft.social.filter((link) => link.id !== id);
          });
        },
        addCustomField: () => {
          applyUpdate((draft) => {
            draft.customFields.push({ id: nanoid(), key: 'Label', value: '' });
          });
        },
        updateCustomField: (id, updater) => {
          applyUpdate((draft) => {
            draft.customFields = draft.customFields.map((field) =>
              field.id === id ? updater(field) : field,
            );
          });
        },
        removeCustomField: (id) => {
          applyUpdate((draft) => {
            draft.customFields = draft.customFields.filter(
              (field) => field.id !== id,
            );
          });
        },
        loadFromStorage: () => {
          if (typeof localStorage === 'undefined') return;
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return;
          try {
            const parsed: PersistedShape = JSON.parse(raw);
            if (parsed?.state) {
              set({ state: parsed.state });
            }
          } catch (error) {
            console.error('Failed to load signature state', error);
          }
        },
      };
    },
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ state: state.state }),
      version: 2,
      migrate: (persistedState: unknown) => {
        const persisted = persistedState as PersistedShape | undefined;
        if (!persisted?.state) {
          return { state: createDefaultState() } as PersistedShape;
        }
        return persisted;
      },
    },
  ),
);

export function getDefaultSignatureState() {
  return createDefaultState();
}

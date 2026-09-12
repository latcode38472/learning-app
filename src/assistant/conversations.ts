/**
 * Conversations with the AI assistant, stored in this browser only (there
 * are no accounts). Kept separate from learning progress so that exporting
 * progress never includes chat text, and so each device has its own history.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Usage } from './client';

export type ChatMode = 'lesson' | 'general';

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'streaming' | 'done' | 'error' | 'stopped';
  error?: { code: string; message: string };
  usage?: Usage | null;
  model?: string;
  at: string;
}

export interface Conversation {
  id: string;
  mode: ChatMode;
  lang: 'en' | 'he';
  lessonId?: string;
  title: string;
  messages: StoredMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationState {
  conversations: Conversation[];
  activeId: string | null;
  create: (init: { mode: ChatMode; lang: 'en' | 'he'; lessonId?: string; title: string }) => Conversation;
  setActive: (id: string | null) => void;
  appendMessage: (conversationId: string, message: StoredMessage) => void;
  updateMessage: (conversationId: string, messageId: string, patch: Partial<StoredMessage>) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

const MAX_CONVERSATIONS = 30;
const MAX_MESSAGES = 80;

export function newId(): string {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useConversations = create<ConversationState>()(
  persist(
    (set) => ({
      conversations: [],
      activeId: null,
      create: (init) => {
        const now = new Date().toISOString();
        const conv: Conversation = { id: newId(), ...init, messages: [], createdAt: now, updatedAt: now };
        set((s) => ({ conversations: [conv, ...s.conversations].slice(0, MAX_CONVERSATIONS), activeId: conv.id }));
        return conv;
      },
      setActive: (id) => set({ activeId: id }),
      appendMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message].slice(-MAX_MESSAGES),
                  updatedAt: message.at,
                  title: c.title || (message.role === 'user' ? message.content.slice(0, 60) : c.title),
                }
              : c,
          ),
        })),
      updateMessage: (conversationId, messageId, patch) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)) } : c)),
        })),
      removeMessage: (conversationId, messageId) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c)),
        })),
      remove: (id) => set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id), activeId: s.activeId === id ? null : s.activeId })),
      clearAll: () => set({ conversations: [], activeId: null }),
    }),
    {
      name: 'codepath.assistant.v1',
      storage: createJSONStorage(() => {
        try {
          window.localStorage.getItem('x');
          return window.localStorage;
        } catch {
          const mem = new Map<string, string>();
          return { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
        }
      }),
      partialize: (s) => ({ conversations: s.conversations.map((c) => ({ ...c, messages: c.messages.map((m) => (m.status === 'streaming' ? { ...m, status: 'stopped' as const } : m)) })), activeId: s.activeId }),
    },
  ),
);

export function selectActive(state: ConversationState): Conversation | undefined {
  return state.conversations.find((c) => c.id === state.activeId);
}

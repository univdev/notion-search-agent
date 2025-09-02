import { create } from 'zustand';

type StreamMessagesStore = {
  messages: Record<string, [string, string] | undefined>;
  setMessage: (conversationId: string, userMessage: string, assistantMessage: string) => void;
  setMessages: (messages: Record<string, [string, string] | undefined>) => void;
  clearMessage: (conversationId: string) => void;
  clearStreamMessages: () => void;
};

const useStreamMessagesStore = create<StreamMessagesStore>((set) => {
  return {
    messages: {},
    setMessage: (conversationId, userMessage, assistantMessage) => {
      return set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [userMessage, assistantMessage],
        },
      }));
    },
    setMessages: (messages) => set({ messages }),
    clearMessage: (conversationId) =>
      set((state) => {
        const messages = { ...state.messages, [conversationId]: undefined };
        return {
          messages,
        };
      }),
    clearStreamMessages: () => set({ messages: {} }),
  };
});

export default useStreamMessagesStore;

import { create } from 'zustand';

type StreamMessagesStore = {
  messages: Record<string, string>;
  setMessage: (conversationId: string, message: string) => void;
  setMessages: (messages: Record<string, string>) => void;
  clearStream: () => void;
};

const useStreamMessagesStore = create<StreamMessagesStore>((set) => {
  return {
    messages: {},
    setMessage: (conversationId, message) =>
      set((state) => ({ messages: { ...state.messages, [conversationId]: message } })),
    setMessages: (messages) => set({ messages }),
    clearStream: () => set({ messages: {} }),
  };
});

export default useStreamMessagesStore;

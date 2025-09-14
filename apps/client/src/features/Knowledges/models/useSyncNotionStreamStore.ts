import { create } from 'zustand';

export type SyncNotionStreamStore = {
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
  syncDocumentsCount: number;
  setSyncDocumentsCount: (syncDocumentsCount: number) => void;
  clear: () => void;
};

const useSyncNotionStreamStore = create<SyncNotionStreamStore>((set) => ({
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  syncDocumentsCount: 0,
  setSyncDocumentsCount: (syncDocumentsCount) => set({ syncDocumentsCount }),
  clear: () => set({ isPending: false, syncDocumentsCount: 0 }),
}));

export default useSyncNotionStreamStore;

// src/stores/useModalStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()(
  immer((set) => ({
    isOpen: false,

    openModal: () =>
      set((state) => {
        state.isOpen = true;
      }),
      
    closeModal: () =>
      set((state) => {
        state.isOpen = false;
      }),
  }))
);
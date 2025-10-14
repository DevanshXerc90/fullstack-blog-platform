import { create } from "zustand";

export type FilterState = {
  selectedCategoryId?: number;
  setSelectedCategoryId: (id?: number) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  selectedCategoryId: undefined,
  setSelectedCategoryId: (id?: number) => set({ selectedCategoryId: id }),
}));

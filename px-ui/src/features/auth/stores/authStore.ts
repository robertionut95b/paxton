import { User } from "@interfaces/user";
import { StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { createStore } from "zustand/vanilla";

type AuthStore = {
  user: User | null;
  setUser: (userData: User | null) => void;
  userLoading: boolean;
  setUserLoading: (newLoading: boolean) => void;
};

export const authStoreErrorState: Partial<AuthStore> = {
  user: null,
  userLoading: false,
};

export const authStore = createStore<AuthStore>((set) => ({
  user: null,
  userLoading: true,
  setUser: (userData: User | null) => set(() => ({ user: userData })),
  setUserLoading: (newLoading: boolean) => set({ userLoading: newLoading }),
}));

const createBoundedUseStore = ((store) => (selector, equals) =>
  useStoreWithEqualityFn(store, selector as never, equals)) as <
  S extends StoreApi<unknown>,
>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(
    selector: (state: ExtractState<S>) => T,
    equals?: (a: T, b: T) => boolean,
  ): T;
};

type ExtractState<S> = S extends { getState: () => infer X } ? X : never;

export const useAuthStore = createBoundedUseStore(authStore);

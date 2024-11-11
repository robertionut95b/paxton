import { User } from "@interfaces/user";
import { StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { createStore } from "zustand/vanilla";

type AuthStore = {
  user: User | null;
  userLoading: boolean;
  setUser: (userData: User | null) => void;
  setUserLoading: (newLoading: boolean) => void;
  accessToken: string | null;
  setAccessToken: (newAccessToken: string | null) => void;
  tokenExpiry: number | null;
  setTokenExpiry: (newTokenExpiry: number | null) => void;
  isRefreshing: boolean;
  setIsRefreshing: (newIsRefreshing: boolean) => void;
};

export const authStoreErrorState: Partial<AuthStore> = {
  isRefreshing: false,
  user: null,
  userLoading: false,
  accessToken: null,
  tokenExpiry: null,
};

export const authStore = createStore<AuthStore>((set) => ({
  user: null,
  userLoading: true,
  setUser: (userData: User | null) => set(() => ({ user: userData })),
  setUserLoading: (newLoading: boolean) => set({ userLoading: newLoading }),
  accessToken: null,
  setAccessToken: (newAccessToken: string | null) =>
    set({ accessToken: newAccessToken }),
  tokenExpiry: null,
  setTokenExpiry: (newTokenExpiry: number | null) =>
    set({ tokenExpiry: newTokenExpiry }),
  isRefreshing: false,
  setIsRefreshing: (newIsRefreshing: boolean) =>
    set({ isRefreshing: newIsRefreshing }),
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

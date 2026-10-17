import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FavoriteCollection = { id: string; name: string; postIds: number[] };

type CollectionsStore = {
  collections: FavoriteCollection[];
  createCollection: (name: string) => void;
  togglePost: (collectionId: string, postId: number) => void;
};

export const useCollections = create<CollectionsStore>()(
  persist(
    (set) => ({
      collections: [],
      createCollection: (name) => set((state) => ({
        collections: [...state.collections, { id: crypto.randomUUID(), name: name.trim(), postIds: [] }],
      })),
      togglePost: (collectionId, postId) => set((state) => ({
        collections: state.collections.map((collection) =>
          collection.id !== collectionId
            ? collection
            : {
                ...collection,
                postIds: collection.postIds.includes(postId)
                  ? collection.postIds.filter((id) => id !== postId)
                  : [...collection.postIds, postId],
              }
        ),
      })),
    }),
    { name: "favorite-collections-storage", storage: createJSONStorage(() => localStorage) }
  )
);

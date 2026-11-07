import { createContext, ReactNode, useContext } from 'react';
import { usePersistentState } from './usePersistentState';

type FavoritesContextValue = {
    favorites: number[];
    loaded: boolean;
    isFavorite: (id: number) => boolean;
    toggleFavorite: (id: number) => void;
  };
  
  const FavoritesContext = createContext<FavoritesContextValue | null>(null);

  export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites, loaded] = usePersistentState<number[]>('favorites', []);
    const isFavorite = (id: number) => favorites.includes(id);

    const toggleFavorite = (id: number) => {
        setFavorites((prev) =>
          prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
      };
    
      return (
        <FavoritesContext.Provider value={{ favorites, loaded, isFavorite, toggleFavorite }}>
          {children}
        </FavoritesContext.Provider>
      );
  }


export function useFavorites(): FavoritesContextValue {
    const ctx = useContext(FavoritesContext);
    if (ctx === null) {
      throw new Error('useFavorites must be used inside <FavoritesProvider>');
    }
    return ctx;
  }
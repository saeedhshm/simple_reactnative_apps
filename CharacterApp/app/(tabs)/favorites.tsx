import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL, Character } from '../../api';
import { CharacterCard } from '../../components/CharacterCard';
import { useFavorites } from '../../FavoritesContext';

export default function FavoritesScreen() {
  const { favorites, loaded } = useFavorites();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  // A string we can safely put in a dependency array
  const idsKey = favorites.join(',');

  useEffect(() => {
    if (!loaded || idsKey === '') return;

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/${idsKey}`, { signal: controller.signal });
        if (res.status === 429) throw new Error('Too many requests. Wait a moment and retry.');
        if (!res.ok) throw new Error(`Server error (${res.status})`);

        const data = (await res.json()) as Character | Character[];
        setCharacters(Array.isArray(data) ? data : [data]);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        console.warn('favorites failed:', e);
        setError(e instanceof Error ? e.message : 'Could not load favorites.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [idsKey, loaded, reloadKey]);

  // Derived data: only show characters that are still favorites
  const visible = characters.filter((c) => favorites.includes(c.id));

  let content;
  if (!loaded || loading) {
    content = <ActivityIndicator size="large" style={styles.center} />;
  } else if (error) {
    content = (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setReloadKey((k) => k + 1)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CharacterCard character={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No favorites yet. Open a character and tap ♡.</Text>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7', paddingTop: 70, paddingHorizontal: 20 },
  title: { fontSize: 34, fontWeight: 'bold', marginBottom: 16 },
  center: { marginTop: 60, alignItems: 'center' },
  errorText: { color: '#ff3b30', fontSize: 16, marginBottom: 12, textAlign: 'center' },
  retryButton: { backgroundColor: '#007aff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: 'white', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16, paddingHorizontal: 20 },
});
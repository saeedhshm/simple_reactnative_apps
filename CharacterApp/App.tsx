import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View, Image } from 'react-native';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

type Character = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
}

type Info = {
  count: number; pages: number; next: string | null;
}

type ApiResponse = {
  info: Info,
  results: Character[]
}

const STATUS_COLORS: Record<Character['status'], string> = {
  Alive: '#34c759',
  Dead: '#ff3b30',
  unknown: '#8e8e93',
};

function CharacterCard({ character }: { character: Character }) {
  return <View style={styles.card}>
    <Image source={{ uri: character.image }} style={styles.avatar} />
    <View style={styles.cardInfo}>
      <Text style={styles.name}>{character.name}</Text>
      <View style={styles.statusRow}>
      <View style={[styles.dot, { backgroundColor: STATUS_COLORS[character.status] }]} />
      <Text style={styles.meta}>
            {character.status} . {character.species}
          </Text>
        
      </View>
    </View>
  </View>
}

export default function App() {

  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [query, setQuery] = useState<string>('')
  const [reloadkey, setReloadKey] = useState<number>(0)

  useEffect(() => {
    const controller = new AbortController()

    const timer = setTimeout(async () => {

      setLoading(true)
      setErrorMessage(null)

      try {
        const res = await fetch(`${BASE_URL}?name=${encodeURIComponent(query.trim())}`, { signal: controller.signal })
        if (res.status === 404) {
          setCharacters([])
          return
        }



        if (!res.ok) throw new Error(`Server error with status ${res.status}`)
        const json = await res.json();
        const responseData = json as ApiResponse
        setCharacters(responseData.results)
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setErrorMessage('Could not load characters. Check your connection.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }

    }, 400)

    return () => {
      clearTimeout(timer);
      controller.abort()
    }
  }, [query, reloadkey])

  let content;

  console.log("loaadin", loading)
  console.log('error message', errorMessage)
  if (loading) {
    content = <ActivityIndicator size='large' style={styles.center} />
  } else if (errorMessage) {
    content = <View style={styles.center} >
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  } else {
    content = <FlatList
      data={characters}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <CharacterCard character={item} />}
      ListEmptyComponent={<Text style={styles.empty}>No characters found.</Text>}

    />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Characters</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder='Search by name...'
        placeholderTextColor="#999"
        autoCorrect={false}
        autoCapitalize='none'
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({

  title: { fontSize: 34, fontWeight: 'bold', marginBottom: 12 },
  center: { marginTop: 60, alignItems: 'center' },
  errorText: { color: '#ff3b30', fontSize: 16, marginBottom: 12, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  avatar: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  meta: { color: '#555', fontSize: 14 },

  input: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 16 },
  container: { flex: 1, backgroundColor: '#f2f2f7', paddingTop: 70, paddingHorizontal: 20 },

});

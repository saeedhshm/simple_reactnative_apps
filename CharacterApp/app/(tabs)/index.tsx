import { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { ApiResponse, BASE_URL, Character, STATUS_COLORS } from '../../api';
import { useRouter } from 'expo-router';
import { CharacterCard } from '../../components/CharacterCard';



export default function App() {

    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [query, setQuery] = useState<string>('')
    const [reloadkey, setReloadKey] = useState<number>(0)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const isRefreshRef = useRef<boolean>(false)

    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const [loadMoreError, setLoadMoreError] = useState<boolean>(false)

    const loadingMoreRef = useRef<boolean>(false)
    const loadMoreControllerRef = useRef<AbortController | null>(null)


    const handleRefreshing = () => {
        isRefreshRef.current = true
        setRefreshing(true)
        setReloadKey((prevValue) => prevValue + 1)
    }

    useEffect(() => {
        const controller = new AbortController()

        const timer = setTimeout(async () => {

            // Get the current refreshing state 
            // (true if comming from pull to refresh)
            // false if first load or pagination
            const isRefreshing = isRefreshRef.current
            isRefreshRef.current = false

            // NEW: block loadMore while page 1 is being reloaded
            setNextUrl(null);
            setLoadMoreError(false);

            if (!refreshing)
                setLoading(true)
            setErrorMessage(null)

            try {
                const res = await fetch(`${BASE_URL}?name=${encodeURIComponent(query.trim())}`, { signal: controller.signal })
                if (res.status === 404) {
                    setCharacters([])
                    setNextUrl(null);
                    return
                }



                if (!res.ok) throw new Error(`Server error with status ${res.status}`)
                const json = await res.json();
                const responseData = json as ApiResponse
                setCharacters(responseData.results)
                setNextUrl(responseData.info.next); // NEW: remember where page 2 is

            } catch (e) {
                // in the effect
                console.warn('page 1 failed:', e)
                if (e instanceof Error && e.name === 'AbortError') return;
                setErrorMessage('Could not load characters. Check your connection.');
            } finally {
                if (!controller.signal.aborted) { setLoading(false); setRefreshing(false); }
            }

        }, 400)

        return () => {
            clearTimeout(timer);
            controller.abort();
            loadMoreControllerRef.current?.abort(); // NEW: cancel any in-flight "page N"

        }
    }, [query, reloadkey])

    let content;

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
            refreshing={refreshing}
            onRefresh={handleRefreshing}
            keyboardShouldPersistTaps="handled"
            onEndReached={() => {
                if (!loadMoreError)
                    loadMore()
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loadingMore ? (<ActivityIndicator style={styles.footer} />) : loadMoreError ? (<TouchableOpacity style={styles.footer} onPress={loadMore}>
                    <Text style={styles.footerError}>Couldn't load more. Tap to retry.</Text>
                </TouchableOpacity>) : undefined
            }
        />
    }

    async function loadMore() {
        if (!nextUrl || loadingMoreRef.current || loading || refreshing || errorMessage)
            return

        loadingMoreRef.current = true
        setLoadingMore(true)
        setLoadMoreError(false)

        const controller = new AbortController()
        loadMoreControllerRef.current = controller

        try {
            const res = await fetch(nextUrl, { signal: controller.signal })

            if (res.status === 429) {
                const wait = res.headers.get('Retry-After');
                throw new Error(`Rate limited. Retry after ${wait ?? 'a few'} seconds.`);
            }

            if (!res.ok) throw new Error(`Server error (${res.status})`);

            const data = (await res.json()) as ApiResponse

            setCharacters((prev) => [...prev, ...data.results])
            setNextUrl(data.info.next)


        } catch (e) {
            console.warn('loadMore failed:', e, 'url:', nextUrl)
            if (e instanceof Error && e.name === 'AbortError') return;
            setLoadMoreError(true);
        } finally {
            if (loadMoreControllerRef.current === controller) {
                loadMoreControllerRef.current = null;
                loadingMoreRef.current = false;
                setLoadingMore(false);
            }
        }

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
    avatar: { width: 90, height: 90, backgroundColor: '#e5e5ea' },
    cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
    statusRow: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    meta: { color: '#555', fontSize: 14 },
    footer: { paddingVertical: 20, alignItems: 'center' },
    footerError: { color: '#ff3b30', fontSize: 15 },
    input: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 16 },
    container: { flex: 1, backgroundColor: '#f2f2f7', paddingTop: 70, paddingHorizontal: 20 },

});

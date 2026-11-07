import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image,
} from "react-native";
import { BASE_URL, CharacterDetails, STATUS_COLORS } from "../../api";
import { useFavorites } from '../../FavoritesContext';

function InfoRow({ label, value }: { label: string, value: string }) {
    return <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
}

export default function CharacterScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()

    const [loading, setLoading] = useState<boolean>(true)
    const [character, setCharacter] = useState<CharacterDetails | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [reloadkey, setReloadKey] = useState<number>(0)

    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {

        const controller = new AbortController()

        async function load() {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch(`${BASE_URL}/${id}`, { signal: controller.signal })
                if (res.status === 429) throw new Error('Too many requests. Wait a moment and retry.')
                if (!res.ok) throw new Error(`Server Error code ${res.status}`)
                const loadedCharacter = (await res.json() as CharacterDetails)
                setCharacter(loadedCharacter)
            } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') return;
                console.warn('detail failed:', e);
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }
        load()

        return () => {
            controller.abort();
        }

    }, [id, reloadkey])

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size='large' />
            </View>
        )
    }

    if (error || !character) {


        return <View style={styles.center}>
            <Text style={styles.errorText}>{error ?? `Character with id: {${id}} not found`}</Text>
            <TouchableOpacity style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        </View>
    }


    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: character.name,
        headerRight:()=>(
            <TouchableOpacity onPress={() => toggleFavorite(character.id)} >
        <Text style={styles.heart}>{isFavorite(character.id) ? '♥' : '♡'}</Text>
      </TouchableOpacity>
        )
        }} />

        <Image source={{ uri: character.image }} style={styles.image} />
        <Text style={styles.name}>{character.name}</Text>

        <View style={styles.statusRow} >
            <View style={[styles.dot, { backgroundColor: STATUS_COLORS[character.status] }]} />
            <Text style={styles.status}>{character.status}</Text>
        </View>

        <View style={styles.card}>
            <InfoRow label="Species" value={character.species} />
            <InfoRow label="Type" value={character.type || 'None'} />
            <InfoRow label="Gender" value={character.gender} />
            <InfoRow label="Origin" value={character.origin.name} />
            <InfoRow label="Last seen" value={character.location.name} />
            <InfoRow label="Episodes" value={String(character.episode.length)} />
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', backgroundColor: '#f2f2f7', padding: 20
    },
    errorText: { color: '#ff3b30', fontSize: 16, marginBottom: 12, textAlign: 'center' },
    retryButton: { backgroundColor: '#007aff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    retryText: { color: 'white', fontWeight: '600' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
    infoLabel: { color: '#888', fontSize: 16 },
    infoValue: { fontSize: 16, fontWeight: '500', flexShrink: 1, textAlign: 'right', marginLeft: 16 },
    image: { width: 220, height: 220, borderRadius: 990, backgroundColor: '#e5e5ea', marginBottom: 16 },
    container: { flex: 1, backgroundColor: '#f2f2f7' },
    name: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 20 },
    dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
    status: { fontSize: 18, color: '#555' },
    card: { alignSelf: 'stretch', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 16 },
    content: { padding: 20, alignItems: 'center' },
heart: { fontSize: 28, color: '#ff3b30' },
    loadingIndicator: {


    }
})
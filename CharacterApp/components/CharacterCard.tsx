import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Character, STATUS_COLORS } from '../api';

export function CharacterCard({ character }: { character: Character }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/character/${character.id}`)}
    >
      <Image source={{ uri: character.image }} style={styles.avatar} />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{character.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: STATUS_COLORS[character.status] }]} />
          <Text style={styles.meta}>
            {character.status} · {character.species}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  avatar: { width: 90, height: 90, backgroundColor: '#e5e5ea' },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  meta: { color: '#555', fontSize: 14 },
});
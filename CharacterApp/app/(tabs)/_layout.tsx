import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../FavoritesContext';

export default function TabsLayout() {

    const {favorites} = useFavorites()

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007aff' }}>
            <Tabs.Screen name='index'
                options={{
                    title: 'Characters',
                    tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={String(color)} />,

                }} />
            <Tabs.Screen name='favorites' options={{
                title: 'Favorites',
tabBarBadge:favorites.length > 0 ? favorites.length : undefined,
                tabBarIcon: ({ color, size }) => <Ionicons name='heart' size={size} color={String(color)} />
            }} />
        </Tabs>
    )
}
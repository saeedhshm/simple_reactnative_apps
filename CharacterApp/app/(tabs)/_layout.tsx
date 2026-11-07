import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007aff' }}>
            <Tabs.Screen name='index'
                options={{
                    title: 'Characters',
                    tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={String(color)} />,

                }} />
            <Tabs.Screen name='favorites' options={{ title: 'Favorites' ,
            tabBarIcon:({color,size}) => <Ionicons name='heart' size={size} color={String(color)} />
            }} />
        </Tabs>
    )
}
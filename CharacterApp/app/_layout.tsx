import { Stack } from "expo-router";
import { FavoritesProvider } from "../FavoritesContext";

export default function RootLayout() {
    return (
        <FavoritesProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="character/[id]" options={{ title: "Character" }} />
            </Stack>
        </FavoritesProvider>
    )
}
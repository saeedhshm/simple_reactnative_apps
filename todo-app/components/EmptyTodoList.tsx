import { Ionicons } from "@expo/vector-icons"
import { View, Text } from "react-native"
import useTheme from "../hooks/useTheme"
import { createHomeStyles } from "@/assets/styles/home.styles";
import { LinearGradient } from "expo-linear-gradient";

function ListEmptyComponent(){

    const {colors} = useTheme();
    const homeStyles = createHomeStyles(colors)

    return <View style={homeStyles.emptyContainer}>
        <LinearGradient colors={colors.gradients.empty} style={homeStyles.emptyIconContainer}>
        <Ionicons name="clipboard-outline" size={80} color={colors.textMuted}/>
        </LinearGradient>
        <Text style={homeStyles.emptyText}>No todos yet!</Text>
        <Text style={homeStyles.emptySubtext}>Add your first todo above to get started</Text>
    </View>
}

export default ListEmptyComponent
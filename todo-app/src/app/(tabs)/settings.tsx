import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { createSettingsStyles } from '../../../assets/styles/settings.styles';
import useTheme from '../../../hooks/useTheme';
import ProgressState from "../../../components/ProgressState";
import Preferences from "../../../components/Preferences";




export default function Settings() {

    const { colors } = useTheme();
    const settingsStyles = createSettingsStyles(colors)


    return <LinearGradient colors={colors.gradients.background} style={settingsStyles.container}>
        <SafeAreaView style={settingsStyles.safeArea}>
            <View style={settingsStyles.header}>
                <View style={settingsStyles.titleContainer}>
                    <LinearGradient colors={colors.gradients.primary} style={settingsStyles.iconContainer}>
                        <Ionicons name="settings" size={28} color="#ffffff" />
                    </LinearGradient>
                    <Text style={settingsStyles.title}>Settings</Text>
                </View>
            </View>

            <ScrollView
                style={settingsStyles.scrollView}
                contentContainerStyle={settingsStyles.content}
                showsVerticalScrollIndicator={false}
            >
                <ProgressState />
                <Preferences />
            </ScrollView>
        </SafeAreaView>
    </LinearGradient>
}



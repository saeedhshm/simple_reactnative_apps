import { createSettingsStyles } from "@/assets/styles/settings.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { api } from "../convex/_generated/api";
import useTheme, { ColorScheme } from "../hooks/useTheme";

const ProgressState = () => {
    const { colors } = useTheme()
    const settingsStyles = createSettingsStyles(colors)

    const todos = useQuery(api.todos_crud.getTodos)
    const totalTodos = todos ? todos.length : 0
    const completedTodos = todos ? todos.filter((todo) => todo.isCompleted).length : 0
    const activeTodos = totalTodos - completedTodos

    return (
        <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
            <Text style={settingsStyles.sectionTitle}>Progress Stats</Text>
            <View style={settingsStyles.statsContainer}>

                {/* TOTAL TODOS */}
                <LinearGradient
                    colors={colors.gradients.background}
                    style={[settingsStyles.statCard, { borderLeftColor: colors.primary }]}
                >
                    <View style={settingsStyles.statIconContainer}>
                        <LinearGradient colors={colors.gradients.primary} style={settingsStyles.statIcon}>
                            <Ionicons name="list" size={20} color="#fff" />
                        </LinearGradient>
                    </View>

                    <View>
                        <Text style={settingsStyles.statNumber}>{totalTodos}</Text>
                        <Text style={settingsStyles.statLabel}>Total Todos</Text>
                    </View>
                </LinearGradient>

                {/* COMPLETED TODOS */}
                <ProgressStateItem todosNumber={completedTodos} color={colors.success} gradientColors={colors.gradients.success} iconName="checkmark-circle" title="Completed" colors={colors} />
                {/* ACTIVE TODOS */}
                <ProgressStateItem todosNumber={activeTodos} color={colors.warning} gradientColors={colors.gradients.warning} iconName="time" title="Active" colors={colors} />

            </View>
        </LinearGradient>
    )
}
interface ProgressStateItemProps {
    todosNumber: number;
    color: string;
    gradientColors: [string, string];
    iconName: "list" | "checkmark-circle" | "time";
    title: string;
    colors: ColorScheme
}

const ProgressStateItem = ({ todosNumber, color, gradientColors, iconName, title, colors }: ProgressStateItemProps) => {

    // const { colors } = useTheme()
    const settingsStyles = createSettingsStyles(colors)

    return <LinearGradient
        colors={colors.gradients.background}
        style={[settingsStyles.statCard, { borderLeftColor: color }]}
    >
        <View style={settingsStyles.statIconContainer}>
            <LinearGradient colors={gradientColors} style={settingsStyles.statIcon}>
                <Ionicons name={iconName} size={20} color="#fff" />
            </LinearGradient>
        </View>

        <View>
            <Text style={settingsStyles.statNumber}>{todosNumber}</Text>
            <Text style={settingsStyles.statLabel}>{title}</Text>
        </View>
    </LinearGradient>


}

export default ProgressState
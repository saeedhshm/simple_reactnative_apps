import { createHomeStyles } from "@/assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../convex/_generated/api";
import useTheme from "../hooks/useTheme";

export default function TodoInput() {

    const { colors } = useTheme();
    const homeStyles = createHomeStyles(colors)

    const [newTodo, setNewTodo] = useState('')

    const addTodo = useMutation(api.todos_crud.addTodo)

    const handleAddTodo = async () => {
        const todoItem = newTodo.trim()

        if (todoItem) {
            try {
                await addTodo({ text: todoItem });
                setNewTodo('')
            } catch (error) {
                Alert.alert('Error', `Failed to add todo with error: ${error}`)
            }
        }

    }
    return <View style={homeStyles.inputSection}>
        <View style={homeStyles.inputWrapper}>
            <TextInput
                style={homeStyles.input}
                placeholder="What needs to be done?"
                value={newTodo}
                onChangeText={setNewTodo}
                placeholderTextColor={colors.textMuted}
                onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity onPress={handleAddTodo} activeOpacity={0.8} disabled={!newTodo.trim()}>
                <LinearGradient
                    colors={newTodo.trim() ? colors.gradients.primary : colors.gradients.muted}
                    style={[homeStyles.addButton, !newTodo.trim() && homeStyles.addButtonDisabled]}
                >
                    <Ionicons name="add" size={24} color={"white"} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </View>
}
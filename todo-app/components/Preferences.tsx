import { Text, View,Switch } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { createSettingsStyles } from "@/assets/styles/settings.styles"
import useTheme, { ColorScheme } from "../hooks/useTheme"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";


const Preferences = () => {

    const [isAutoSync, setIsAutoSync] = useState(true);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const {isDarkMode, toggleDarkMode, colors} = useTheme();

    const settingsStyles = createSettingsStyles(colors);


    return (
        <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
      <Text style={settingsStyles.sectionTitle}>Preferences</Text>
      <PreferenceItem colors={colors} iconName="moon" title="Dark mode" onValueChange={toggleDarkMode} switchValue={isDarkMode}/>
      </LinearGradient>
    )
}

interface PreferenceItem{
    colors: ColorScheme
    onValueChange:()=>void
    switchValue:boolean,
    iconName:"moon" | "notifications" 
    title:string

}

const PreferenceItem = ({colors,onValueChange,switchValue,title,iconName}:PreferenceItem) => {

    const settingsStyles = createSettingsStyles(colors);

    return     <View style={settingsStyles.settingItem}>
    <View style={settingsStyles.settingLeft}>
      <LinearGradient colors={colors.gradients.warning} style={settingsStyles.settingIcon}>
        <Ionicons name={iconName} size={18} color="#fff" />
      </LinearGradient>
      <Text style={settingsStyles.settingText}>{title}</Text>
    </View>
    <Switch
      value={switchValue}
      onValueChange={onValueChange}
      thumbColor={"#fff"}
      trackColor={{ false: colors.border, true: colors.warning }}
      ios_backgroundColor={colors.border}
    />
  </View>
}



export default Preferences
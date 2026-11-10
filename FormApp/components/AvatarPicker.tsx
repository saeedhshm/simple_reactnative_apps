import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

type AvatarPickerProps = {
  avatar: string | null;
  onChange: (uri: string | null) => void;
};

export function AvatarPicker({
  avatar,
  onChange,
}: AvatarPickerProps) {

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos.',
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!result.canceled && result.assets.length > 0) {
        onChange(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Could not select image.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.icon}>👤</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.label}>
          {avatar ? 'Change Photo' : 'Choose Profile Photo'}
        </Text>
      </TouchableOpacity>

      {avatar && (
        <TouchableOpacity onPress={() => onChange(null)}>
          <Text style={styles.remove}>Remove Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 45,
  },
  label: {
    marginTop: 12,
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  remove: {
    marginTop: 8,
    color: '#EF4444',
    fontSize: 13,
  },
});
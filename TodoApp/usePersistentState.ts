import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistentState<T>(key: string, initValue: T): [T, Dispatch<SetStateAction<T>>, boolean] {
    const [value, setValue] = useState<T>(initValue)
    const [loaded, setLoaded] = useState<boolean>(false)

    // will load once the app started
    useEffect(() => {
        const loadData = async () => {
            try {
                const json = await AsyncStorage.getItem(key)
                if (json !== null) {
                    setValue(JSON.parse(json) as T)
                }
            } catch (error) {
                console.warn(`Failed to load "${key}"`, error);
            } finally {
                setLoaded(true)
            }
            
        }
        loadData()
    }, [key])

    // will load every time the key, value or loaded change
    useEffect(() => {
        AsyncStorage.setItem(key, JSON.stringify(value)).catch((err) => console.warn(`Failed to save "${key}"`, err))
    }, [key, value, loaded])

    return [value, setValue, loaded]
}
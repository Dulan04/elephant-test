import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [targetPath, setTargetPath] = useState<string | null>(null);

  useEffect(() => {
    checkAppStatus();
  }, []);

  const checkAppStatus = async () => {
    try {
      // 🔴 TEMPORARY TEST CODE: Wipes the memory so the app thinks it's a brand new install
      //🙂
      await AsyncStorage.clear(); 

      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      
      if (hasLaunched === null) {
        // New user or just re-installed
        setTargetPath('/WelcomeScreen');
      } else {
        // Returning user - check if they have a token
        const token = await AsyncStorage.getItem('userToken');
        setTargetPath(token ? '/home' : '/AuthScreen');
      }
    } catch (e) {
      setTargetPath('/WelcomeScreen');
    }
  };

  if (!targetPath) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#265C2F" />
      </View>
    );
  }

  return <Redirect href={targetPath as any} />;
}
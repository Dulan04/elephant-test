import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

    

  const checkFirstLaunch = async () => {
    try {
      //------------------------------------
      // 🔴 TEMPORARY: Uncomment this line to reset everything
      await AsyncStorage.clear();   
      //------------------------------------

      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      // If result is null, it means they have never been here before.
      if (hasLaunched === null) {
        setIsFirstLaunch(true); 
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      setIsFirstLaunch(false); // Default to Home if error
    }
  };

  // Show loading spinner while checking
  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // If first launch, go to Welcome. Otherwise, go to Home.
  return isFirstLaunch ? <Redirect href="/WelcomeScreen" /> : <Redirect href={"/home" as any} />;
}
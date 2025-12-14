// 1. Make sure this import is correct!
import { StatusBar } from 'expo-status-bar'; 

import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="WelcomeScreen" />
        <Stack.Screen name="home" />
      </Stack>
      
      {/* 2. Now 'style' will work. If "dark" is still red, try "auto" */}
      <StatusBar style="dark" />
    </>
  );
}
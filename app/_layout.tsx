import { StatusBar } from 'expo-status-bar'; 
import { Stack } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import ElephantAlert from '../components/ElephantAlert';
import { BASE_URL } from '../constants/api';

// FIX 1: Added shouldShowBanner and shouldShowList for SDK 53
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true, 
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [showAlert, setShowAlert] = useState(false);
  
  // FIX 2: Added "| null" and "(null)" to satisfy TypeScript's strict mode
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    setupPushNotifications();
  }, []);

  useEffect(() => {
    if (lastNotificationResponse?.notification.request.content.data?.type === 'ELEPHANT_ALERT') {
      setShowAlert(true);
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.data?.type === 'ELEPHANT_ALERT') setShowAlert(true);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification.request.content.data?.type === 'ELEPHANT_ALERT') setShowAlert(true);
    });

    // FIX 3: Replaced the old global remove function with direct .remove() calls
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  async function setupPushNotifications() {
    // Note: Bypassing Expo Go to prevent the crash you saw earlier!
    if (Constants.appOwnership === 'expo') {
      console.log('Push notifications skipped in Expo Go.');
      return; 
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('elephant-alerts', {
        name: 'Elephant Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#DC2626',
        sound: 'alert.wav', 
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      const username = await AsyncStorage.getItem('username');
      
      // Save token to Spring Boot Database
      if (username) {
        try {
          await fetch(`${BASE_URL}/users/${username}/token`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
          });
        } catch (error) {
          console.log("Could not save token:", error);
        }
      }
    }
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="WelcomeScreen" />
        <Stack.Screen name="home" />
        <Stack.Screen name="HomeScreen" />
        <Stack.Screen name="HomeScreen" />
        <Stack.Screen name="NewsDetail" />
        <Stack.Screen name="tips/SpaceTip" />
        <Stack.Screen name="tips/PhotoTip" />
        <Stack.Screen name="tips/VehicleTip" />
        <Stack.Screen name="tips/NightTip" />
      </Stack>
      <StatusBar style="dark" />
      <ElephantAlert isVisible={showAlert} onClose={() => setShowAlert(false)} />
    </>
  );
}
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_IMAGE = require('@/assets/elephant_bg.png');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light'); 
    }
  }, []);

  const handleGetStarted = async () => {
    // 1. SAVE THE FLAG: "User has seen this screen"
    await AsyncStorage.setItem('hasLaunched', 'true');
    // 2. NAVIGATE to the new Home file
    router.replace('/home' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <View style={styles.topSection}>
            <View style={styles.header}>
              <Text style={styles.logoText}>🐘 ElephantGuard</Text>
            </View>
            <Text style={styles.title}>Welcome to{'\n'}ElephantGuard</Text>
            <Text style={styles.subtitle}>together for harmony.</Text>
          </View>
          <View style={styles.spacer} />
          <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleGetStarted}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  topSection: { paddingHorizontal: 24, marginTop: 10, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  logoText: { fontSize: 18, fontWeight: '700', color: '#3E4E3F', marginLeft: 8 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', color: '#4A4A3A', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#1C2E20', fontWeight: '500' },
  spacer: { flex: 1 },
  bottomSection: { paddingHorizontal: 24, width: '100%' },
  primaryButton: { backgroundColor: '#265C2F', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
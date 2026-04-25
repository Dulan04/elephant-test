import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNavigation = async (isLogin: boolean) => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.push({ pathname: '/AuthScreen', params: { isLogin: isLogin ? 'true' : 'false' } });
  };

  return (
    <ImageBackground 
      source={require('../assets/elephant_bg.png')} 
      style={styles.background} 
      resizeMode="cover"
    >
      {/* The overlay adds a slight tint so your text stays readable over the image */}
      <SafeAreaView style={styles.overlay}>
        
        <View style={styles.header}>
          <Text style={styles.logoText}>🐘 ElephantGuard</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to{"\n"}ElephantGuard</Text>
          <Text style={styles.description}>
            Together for harmony. Our mission is to reduce human-elephant conflict through community, communication, and early detection.
          </Text>
        </View>

        {/* This spacer pushes the text up and the buttons down */}
        <View style={styles.spacer} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.getStartedBtn} onPress={() => handleNavigation(false)}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn} onPress={() => handleNavigation(true)}>
            <Text style={styles.loginText}>I already have an account</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={styles.link}>Terms & Privacy Policy</Text>.
          </Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  overlay: { 
    flex: 1, 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(235, 242, 232, )', // Semi-transparent green tint
  },
  header: { alignItems: 'center', marginTop: 40 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#1C3B22' },
  textContainer: { paddingHorizontal: 30, alignItems: 'center', marginTop: 30 },
  title: { fontSize: 36, fontWeight: '900', textAlign: 'center', color: '#1C3B22', marginBottom: 15 },
  description: { fontSize: 16, textAlign: 'center', color: '#1C3B22', lineHeight: 24, fontWeight: '500' },
  spacer: { flex: 1 },
  footer: { paddingHorizontal: 25, paddingBottom: 30 },
  getStartedBtn: { backgroundColor: '#265C2F', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  getStartedText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  loginBtn: { borderWidth: 2, borderColor: '#265C2F', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginBottom: 20,  },
  loginText: { color: '#265C2F', fontSize: 18, fontWeight: 'bold' },
  termsText: { textAlign: 'center', fontSize: 12, color: '#1C3B22' },
  link: { fontWeight: 'bold', textDecorationLine: 'underline' ,padding: 20,}
});
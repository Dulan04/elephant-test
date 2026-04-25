import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';

// --- GOOGLE IMPORTS ---
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isLogin, setIsLogin] = useState(params.isLogin === 'true');
  const [loading, setLoading] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- GOOGLE CONFIGURATION ---
  // Replace these with your actual Client IDs from Google Cloud Console
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      sendGoogleTokenToBackend(id_token);
    }
  }, [response]);

  const sendGoogleTokenToBackend = async (googleToken: string | undefined) => {
    if (!googleToken) return;
    
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.GOOGLE_LOGIN, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });
      
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch (e) {
        Alert.alert("Server Error", "Backend did not send JSON.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        // Apply the same safety net here just in case!
        const tokenToSave = data.token || data.accessToken || data.jwt;
        const usernameToSave = data.username || "User";

        if (!tokenToSave) {
           Alert.alert("Data Error", `Server replied: ${rawText}`);
           setLoading(false);
           return;
        }

        await AsyncStorage.setItem('userToken', String(tokenToSave));
        await AsyncStorage.setItem('username', String(usernameToSave));
        router.replace('/home' as any);
      } else {
         Alert.alert("Google Login Failed", data.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Could not reach server. Check IP address.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.isLogin !== undefined) {
      setIsLogin(params.isLogin === 'true');
    }
  }, [params.isLogin]);

  // --- MANUAL LOGIN WITH BULLETPROOF ERROR HANDLING & SAFETY NET ---
  const handleAuth = async () => {
    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const url = isLogin ? ENDPOINTS.LOGIN : ENDPOINTS.SIGNUP;
    const body = isLogin 
      ? { usernameOrEmail: email || username, password } 
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const rawText = await response.text();
      console.log("Server Response:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.log("Failed to parse:", rawText);
        Alert.alert("Server Error", "Check your Spring Boot terminal.");
        setLoading(false);
        return; 
      }

      // --- THE SAFETY NET IS HERE ---
      if (response.ok) {
        if (isLogin) {
          // 1. Find the token no matter what the backend called it
          const tokenToSave = data.token || data.accessToken || data.jwt;
          const usernameToSave = data.username || "User";

          // 2. Stop and warn us if the server didn't send one
          if (!tokenToSave) {
             Alert.alert("Data Error", `Server replied: ${rawText}`);
             setLoading(false);
             return;
          }

          // 3. Force them to be Strings before saving (prevents crashes!)
          await AsyncStorage.setItem('userToken', String(tokenToSave));
          await AsyncStorage.setItem('username', String(usernameToSave));
          
          router.replace('/home' as any);
        } else {
          Alert.alert("Success", "Account created! Please log in.");
          setIsLogin(true);
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }

    } catch (error) {
      console.log("Network Error:", error);
      Alert.alert("Error", "Could not reach server. Is your IP correct?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
          <Text style={styles.headerTitle}>Login or Register</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={{fontSize: 50}}>🐘</Text> 
          <Text style={styles.subtitle}>Securely connect for HEC alerts & reporting</Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, isLogin ? styles.activeLoginBtn : null]} 
            onPress={() => setIsLogin(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, isLogin ? styles.activeText : styles.inactiveText]}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isLogin ? styles.activeRegisterBtn : null]} 
            onPress={() => setIsLogin(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, !isLogin ? styles.activeText : styles.inactiveText]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {!isLogin && (
            <TextInput 
              placeholder="Username" 
              style={styles.input} 
              value={username} 
              onChangeText={setUsername} 
              autoCapitalize="none" 
            />
          )}
          
          <TextInput 
            placeholder={isLogin ? "Email or Username" : "Email Address"} 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType={!isLogin ? "email-address" : "default"}
          />

          <TextInput 
            placeholder="Password" 
            style={styles.input} 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />

          {!isLogin && (
            <TextInput 
              placeholder="Confirm Password" 
              style={styles.input} 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry 
            />
          )}

          <TouchableOpacity style={styles.mainButton} onPress={handleAuth} disabled={loading}>
            <Text style={styles.mainButtonText}>
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.line} />
          </View>
          
          <TouchableOpacity 
            style={styles.googleButton} 
            disabled={!request || loading} 
            onPress={() => promptAsync()}
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, padding: 20, paddingTop: 50 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: '20%' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  subtitle: { fontSize: 14, color: '#333', marginTop: 10, fontWeight: '500' },
  
  toggleContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#C47A47', 
    borderRadius: 30, 
    marginBottom: 25,
    height: 50,
  },
  toggleBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
  activeLoginBtn: { backgroundColor: '#1363A6' }, 
  activeRegisterBtn: { backgroundColor: '#A65A2A' }, 
  toggleText: { fontSize: 16, fontWeight: 'bold' },
  activeText: { color: '#FFF' },
  inactiveText: { color: '#FFF', opacity: 0.8 }, 

  formContainer: { marginBottom: 20 },
  input: { 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#CCC', 
    padding: 15, 
    borderRadius: 30, 
    marginBottom: 15,
    fontSize: 16,
  },
  mainButton: { 
    backgroundColor: '#1363A6', 
    padding: 18, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginTop: 10 
  },
  mainButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  socialSection: { alignItems: 'center', marginTop: 20 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 10, color: '#666' },
  googleButton: { 
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 1.5,
  }
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Dimensions, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ElephantMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // State for the Registration Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Form Inputs (Phone Number Removed)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setIsRegistered(true);
    }
  };

  const handleRegister = async () => {
    // 1. Validate fields (No phone check)
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // 🟢 BACKEND CONNECTION
      const response = await fetch('https://your-backend-api.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username,
          email: email,
          password: password,
        }), 
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token || 'dummy-token');
        setIsRegistered(true);
        setShowRegisterModal(false);
        Alert.alert("Welcome!", "You are now registered.");
      } else {
        Alert.alert("Registration Failed", data.message || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  const handleLongPress = (e: any) => {
    if (!isRegistered) {
      Alert.alert(
        "Registration Required",
        "To protect the community, you must register once before posting alerts.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Register Now", onPress: () => setShowRegisterModal(true) }
        ]
      );
      return;
    }

    const coordinate = e.nativeEvent.coordinate;
    const newPin = {
      id: Date.now(),
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      title: 'Elephant Sighting',
    };

    setMarkers([...markers, newPin]);
    savePinToBackend(newPin);
  };

  const savePinToBackend = async (pin: any) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await fetch('https://your-backend-api.com/sightings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pin),
      });
    } catch (error) {
      console.log("Error saving pin", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 2.5,
          longitudeDelta: 2.5,
        }}
        onLongPress={handleLongPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            pinColor="orange"
          />
        ))}
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Long Press to pin an elephant 🐘</Text>
      </View>

      {/* --- REGISTRATION MODAL --- */}
      <Modal visible={showRegisterModal} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Account</Text>
            
            {/* Username Input */}
            <TextInput 
              placeholder="Your Name" 
              style={styles.input} 
              value={username}
              onChangeText={setUsername}
            />
            
            {/* Email Input */}
            <TextInput 
              placeholder="Email Address" 
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input} 
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input */}
            <TextInput 
              placeholder="Password" 
              secureTextEntry={true}
              style={styles.input} 
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowRegisterModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  map: { width: width, height: '100%' },
  infoBox: {
    position: 'absolute', top: 50, backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10, borderRadius: 20, elevation: 3,
  },
  infoText: { fontWeight: '600', color: '#333' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', padding: 25, borderRadius: 15, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { width: '100%', height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#FAFAFA' },
  registerButton: { width: '100%', backgroundColor: '#F97316', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  registerButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelText: { color: '#666', marginTop: 5 }
});
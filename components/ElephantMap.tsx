import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Dimensions, TextInput, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ElephantMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // State for the Registration Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    // Check if this user is already registered on this phone
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setIsRegistered(true);
    }
  };

  // 1. This function runs when the user clicks "Register" in the modal
  const handleRegister = async () => {
    if (!username || !phoneNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // 🟢 BACKEND CONNECTION HERE: REGISTER USER
      // Replace with your real backend URL
      const response = await fetch('https://your-backend-api.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username,
          phone: phoneNumber,
          // Add other fields your backend needs (e.g., device ID)
        }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token so they don't have to register again
        await AsyncStorage.setItem('userToken', data.token || 'dummy-token');
        setIsRegistered(true);
        setShowRegisterModal(false); // Close the popup
        Alert.alert("Welcome!", "You are now registered. You can pin locations.");
      } else {
        Alert.alert("Registration Failed", data.message || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  const handleLongPress = (e: any) => {
    // A. IF NOT REGISTERED -> Open Registration Popup
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

    // B. IF REGISTERED -> Add Pin
    const coordinate = e.nativeEvent.coordinate;
    const newPin = {
      id: Date.now(),
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      title: 'Elephant Sighting',
    };

    setMarkers([...markers, newPin]);

    // 🟢 BACKEND CONNECTION HERE: SEND LOCATION
    // (This part stays the same as before)
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

      {/* --- SIMPLE REGISTRATION MODAL --- */}
      <Modal visible={showRegisterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>One-Time Registration</Text>
            
            <TextInput 
              placeholder="Your Name" 
              style={styles.input} 
              value={username}
              onChangeText={setUsername}
            />
            <TextInput 
              placeholder="Phone Number" 
              keyboardType="phone-pad"
              style={styles.input} 
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowRegisterModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  registerButton: { width: '100%', backgroundColor: '#F97316', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  registerButtonText: { color: 'white', fontWeight: 'bold' },
  cancelText: { color: '#666' }
});
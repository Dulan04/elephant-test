import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
// Note the corrected import here: LongPressEvent instead of MapPressEvent
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '@/constants/api';

type Sighting = {
  id?: string;
  latitude: number;
  longitude: number;
  reportedBy: string;
};

export default function ElephantMap() {
  const [markers, setMarkers] = useState<Sighting[]>([]);
  const [tempMarker, setTempMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [username, setUsername] = useState<string>('Anonymous');

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem('username');
      if (storedName) setUsername(storedName);
    };
    
    loadUserData();
    fetchSightings();
  }, []);

  const fetchSightings = async () => {
    try {
      const response = await fetch(ENDPOINTS.SIGHTINGS);
      const data = await response.json();
      if (response.ok) {
        setMarkers(data);
      }
    } catch (error) {
      console.log("Could not load map pins:", error);
    }
  };

  // Note the corrected event type here
  const handleMapLongPress = (event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setTempMarker(coordinate); 
  };

  const saveSighting = async () => {
    if (!tempMarker) return;

    const newSighting: Sighting = {
      latitude: tempMarker.latitude,
      longitude: tempMarker.longitude,
      reportedBy: username,
    };

    try {
      const response = await fetch(ENDPOINTS.SIGHTINGS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSighting),
      });

      if (response.ok) {
        const savedData = await response.json();
        setMarkers((current) => [...current, savedData]); 
        setTempMarker(null); 
        Alert.alert("Success", "Elephant sighting reported!");
      }
    } catch (error) {
      Alert.alert("Error", "Could not save sighting to server.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.8731, 
          longitude: 80.7718,
          latitudeDelta: 2.5,
          longitudeDelta: 2.5,
        }}
        onLongPress={handleMapLongPress} 
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title="🐘 Elephant Sighted"
            description={`Reported by ${marker.reportedBy}`}
            pinColor="orange"
          />
        ))}

        {tempMarker && (
          <Marker
            coordinate={tempMarker}
            title="New Sighting Here?"
            pinColor="blue"
          />
        )}
      </MapView>

      {tempMarker && (
        <View style={styles.confirmContainer}>
          <TouchableOpacity style={styles.confirmBtn} onPress={saveSighting}>
            <Text style={styles.confirmText}>Confirm Sighting Here</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setTempMarker(null)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  confirmContainer: {
    position: 'absolute',
    bottom: 100, 
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#F97316',
    padding: 15,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: {
    flex: 0.5,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  cancelText: { color: '#333', fontWeight: 'bold', fontSize: 16 }
});
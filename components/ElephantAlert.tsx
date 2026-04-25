import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function ElephantAlert({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (isVisible) playSound();
    return () => { if (sound) sound.unloadAsync(); };
  }, [isVisible]);

  async function playSound() {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/alert.wav') 
      );
      setSound(newSound);
      await newSound.setIsLoopingAsync(true);
      await newSound.playAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }

  const handleDismiss = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Ionicons name="warning" size={80} color="#DC2626" />
          <Text style={styles.title}>ELEPHANT ALERT</Text>
          <Text style={styles.message}>
            An elephant has crossed the boundary line nearby! Please stay indoors and remain vigilant.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleDismiss}>
            <Text style={styles.buttonText}>I Understand - Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(220, 38, 38, 0.95)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertBox: { backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', width: '100%', elevation: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#DC2626', marginTop: 15, marginBottom: 10 },
  message: { fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 30, lineHeight: 24, fontWeight: 'bold' },
  button: { backgroundColor: '#1C3B22', paddingVertical: 18, paddingHorizontal: 30, borderRadius: 30, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
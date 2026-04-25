import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base64-arraybuffer';
import DateTimePicker from '@react-native-community/datetimepicker'; 

import { supabase } from '../lib/supabase';
import { BASE_URL } from '../constants/api';
import BottomNav from '../components/BottomNav'; 

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [pushAlerts, setPushAlerts] = useState(true);
  const [idNumber, setIdNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Calendar State
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // User Info State
  const [username, setUsername] = useState('User');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Load Initial Profile Data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return router.replace('/');

      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setProfilePic(data.imageUrl);
        setIdNumber(data.idCardNumber || '');
        setBirthday(data.birthday || '');
        setAge(data.age ? String(data.age) : '');
        setGender(data.gender || '');
        setMobileNumber(data.mobileNumber || '');
        setPushAlerts(data.pushAlertsEnabled !== false);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setFetching(false);
    }
  };

  // NIC Logic: Auto-fill Age, Gender, AND Birthday
  const handleIdChange = (text: string) => {
    setIdNumber(text);
    
    let year, days;
    const cleanText = text.trim().toLowerCase();

    if (cleanText.length === 10 && (cleanText.endsWith('v') || cleanText.endsWith('x'))) {
      year = parseInt("19" + cleanText.substring(0, 2));
      days = parseInt(cleanText.substring(2, 5));
    } else if (cleanText.length === 12 && !isNaN(Number(cleanText))) {
      year = parseInt(cleanText.substring(0, 4));
      days = parseInt(cleanText.substring(4, 7));
    } else {
      return; 
    }

    if (days > 500) {
      setGender("Female");
      days = days - 500; 
    } else {
      setGender("Male");
    }

    const currentYear = new Date().getFullYear();
    setAge(String(currentYear - year));

    const dob = new Date(2000, 0, days); 
    const dd = String(dob.getDate()).padStart(2, '0');
    const mm = String(dob.getMonth() + 1).padStart(2, '0');
    setBirthday(`${dd} / ${mm} / ${year}`);
  };

  // Handle Calendar Selection
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setBirthday(`${dd} / ${mm} / ${yyyy}`);

      const currentYear = new Date().getFullYear();
      setAge(String(currentYear - yyyy));
    }
  };

  // Handle Image Selection & Upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setLoading(true);
      try {
        const base64File = result.assets[0].base64;
        const ext = result.assets[0].uri.split('.').pop();
        const fileName = `${username}-${Date.now()}.${ext}`;

        if (profilePic && profilePic.includes('supabase.co')) {
          const oldFileName = profilePic.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('profile').remove([oldFileName]);
          }
        }

        const { error } = await supabase.storage
          .from('profile')
          .upload(fileName, decode(base64File), { contentType: `image/${ext}` });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('profile').getPublicUrl(fileName);
        setProfilePic(publicUrl);
        
        // Auto-save image to backend
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          await fetch(`${BASE_URL}/users/${username}/image?url=${encodeURIComponent(publicUrl)}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
        Alert.alert("Success", "Profile picture updated automatically!");

      } catch (error) {
        Alert.alert("Upload Failed", "Could not upload image.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Save changes to backend
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const payload = {
        imageUrl: profilePic,
        idCardNumber: idNumber,
        birthday: birthday,
        age: parseInt(age) || 0,
        gender: gender,
        mobileNumber: mobileNumber,
        pushAlertsEnabled: pushAlerts
      };

      const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      Alert.alert("Error", "Could not save profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  // Bottom Nav Handler
  const handleTabPress = (id: string) => {
    if (id !== 'Profile') {
      router.replace('/home'); 
    }
  };

  if (fetching) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#265C2F" /></View>;
  }

  return (
    <View style={styles.container}>
      
      {/* NEW: KeyboardAvoidingView forces the screen to slide up when typing */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled" // Allows clicking buttons without dismissing keyboard first
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={profilePic ? { uri: profilePic } : require('../assets/icon.png')} style={styles.avatar} />
              <TouchableOpacity style={styles.editIcon} onPress={pickImage} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Ionicons name="pencil" size={16} color="#FFF" />}
              </TouchableOpacity>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{username}</Text>
              <Text style={styles.memberText}>Update your details below</Text>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Receive Push Alerts</Text>
            <Switch 
              value={pushAlerts} 
              onValueChange={setPushAlerts}
              trackColor={{ false: "#D1D5DB", true: "#265C2F" }}
              thumbColor="#FFF"
            />
          </View>

          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.formCard}>
            <Text style={styles.label}>ID Card Number</Text>
            <TextInput style={styles.input} placeholder="Enter ID card number" value={idNumber} onChangeText={handleIdChange} />
            
            <Text style={styles.label}>Birthday</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput style={styles.input} placeholder="DD / MM / YYYY" value={birthday} editable={false} />
              </View>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} placeholder="Enter age" keyboardType="numeric" value={age} onChangeText={setAge} />
            <Text style={styles.label}>Gender</Text>
            <TextInput style={styles.input} placeholder="Enter gender" value={gender} onChangeText={setGender} />
            
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput style={styles.input} placeholder="Enter phone number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

   
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  // Increased paddingBottom slightly to give the keyboard extra clearance
  content: { padding: 20, paddingTop: 50, paddingBottom: 140 }, 
  navContainer: { paddingBottom: 20, paddingHorizontal: 10, backgroundColor: 'transparent' }, 
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E5E7EB' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6B7280', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  nameContainer: { marginLeft: 20 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  memberText: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  toggleText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  sectionTitle: { fontSize: 14, color: '#6B7280', marginBottom: 10, marginLeft: 5 },
  formCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 3, marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 14, fontSize: 16, color: '#111827', marginBottom: 15 },
  saveButton: { backgroundColor: '#265C2F', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  logoutButton: { borderWidth: 2, borderColor: '#991B1B', padding: 16, borderRadius: 30, alignItems: 'center' },
  logoutButtonText: { color: '#991B1B' ,fontSize: 18, fontWeight: 'bold' }
});
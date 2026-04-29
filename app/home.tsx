import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';

import BottomNav from '@/components/BottomNav';
import ElephantMap from '@/components/ElephantMap';

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState('Home');
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  useEffect(() => {
    if (tab) setCurrentTab(tab);
  }, [tab]);

  const handleTabPress = (id: string) => {
    if (id === 'Profile') {
      router.push('/Profile');
    } else {
      setCurrentTab(id);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'Home':
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.title}>Community App</Text>
              <Text style={styles.subtitle}>Dashboard</Text>
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>
                  (Recent Alerts will appear here)
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'Map':
        return <ElephantMap />;

      default:
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.placeholderText}>Page: {currentTab} (Coming Soon)</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      <View style={styles.navContainer}>
        <BottomNav 
          activeTab={currentTab} 
          onTabPress={handleTabPress} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  contentContainer: { flex: 1 },
  navContainer: { paddingBottom: 20, paddingHorizontal: 10, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 100, paddingTop: 20, paddingHorizontal: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderContainer: { marginTop: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 30 },
  placeholderBox: { width: '100%', height: 200, backgroundColor: 'white', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  placeholderText: { color: '#9CA3AF', fontStyle: 'italic' }
});
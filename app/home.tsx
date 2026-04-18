import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '@/components/BottomNav';
// Import the new Map Component
import ElephantMap from '@/components/ElephantMap';

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState('Home');

  // Helper function to render content based on the active tab
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
        // Render the Full Screen Map
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
      
      {/* 1. Dynamic Content Area */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {/* 2. Bottom Navigation Wrapper */}
      {/* Added this wrapper to lift the nav bar up */}
      <View style={styles.navContainer}>
        <BottomNav 
          activeTab={currentTab} 
          onTabPress={(id) => setCurrentTab(id)} 
        />
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    flex: 1,
    // We remove padding here so the Map can go edge-to-edge
  },
  // --- NEW STYLE ---
  navContainer: {
    paddingBottom: 20, // <--- Change this number to move it higher or lower
    paddingHorizontal: 10, // Optional: Adds a little space on sides for a "floating" look
    backgroundColor: 'transparent', 
  },
  // -----------------
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  placeholderBox: {
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
});
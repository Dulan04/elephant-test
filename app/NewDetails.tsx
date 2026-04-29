// app/NewsDetail.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NewsDetail() {
  const { title, description, imageUrl, createdAt } = useLocalSearchParams<{
    title: string; description: string; imageUrl: string; createdAt: string;
  }>();
  const router = useRouter();

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return ''; }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={48} color="#ccc" />
            </View>
          )}
          <View style={styles.imageOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Ionicons name="alert-circle" size={13} color="#fff" />
              <Text style={styles.tagText}>Wildlife Alert</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.divider} />

          <Text style={styles.body}>{description || 'No additional details available for this report.'}</Text>

          {/* Stay Safe reminder */}
          <View style={styles.safetyBox}>
            <Ionicons name="shield-checkmark" size={22} color="#2E7D32" />
            <Text style={styles.safetyText}>Stay safe — keep a distance of at least 100 metres from elephants at all times.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { position: 'relative' },
  heroImage: { width: '100%', height: 280 },
  imagePlaceholder: { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, height: 280, backgroundColor: 'rgba(0,0,0,0.25)' },
  backBtn: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20, padding: 8 },
  content: { padding: 20 },
  tagRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#2E7D32', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 12, color: '#6B7280' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', lineHeight: 30, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  body: { fontSize: 15, color: '#374151', lineHeight: 24 },
  safetyBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, marginTop: 24, borderLeftWidth: 3, borderLeftColor: '#2E7D32' },
  safetyText: { flex: 1, fontSize: 13, color: '#166534', lineHeight: 19, fontWeight: '500' },
});
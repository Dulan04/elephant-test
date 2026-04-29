// components/TipPage.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

type Section = { heading: string; body: string };

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  title: string;
  subtitle: string;
  heroEmoji: string;
  sections: Section[];
};

export default function TipPage({ icon, color, bgColor, title, subtitle, heroEmoji, sections }: Props) {
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: color }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{heroEmoji}</Text>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name={icon} size={34} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSubtitle}>{subtitle}</Text>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((s, i) => (
            <View key={i} style={styles.sectionCard}>
              <View style={[styles.sectionNumber, { backgroundColor: color }]}>
                <Text style={styles.sectionNumberText}>{i + 1}</Text>
              </View>
              <View style={styles.sectionBody}>
                <Text style={[styles.sectionHeading, { color }]}>{s.heading}</Text>
                <Text style={styles.sectionText}>{s.body}</Text>
              </View>
            </View>
          ))}

          {/* Remember card */}
          <View style={[styles.rememberCard, { borderColor: color, backgroundColor: color + '12' }]}>
            <Ionicons name="shield-checkmark" size={24} color={color} />
            <Text style={[styles.rememberText, { color }]}>
              Your safety and the elephant's wellbeing depend on each other. When in doubt — back away.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingTop: 20, paddingBottom: 40, paddingHorizontal: 24, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8, marginBottom: 16 },
  heroEmoji: { fontSize: 52, marginBottom: 8 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontWeight: '500' },
  sectionsContainer: { padding: 20, gap: 14 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  sectionNumber: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 2, flexShrink: 0 },
  sectionNumberText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  sectionBody: { flex: 1 },
  sectionHeading: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  sectionText: { fontSize: 14, color: '#374151', lineHeight: 21 },
  rememberCard: { borderRadius: 16, borderWidth: 1.5, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 6 },
  rememberText: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
});
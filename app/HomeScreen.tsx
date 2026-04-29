// app/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Animated, ActivityIndicator, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomNav from '@/components/BottomNav';
import { BASE_URL } from '@/constants/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

type NewsItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

const SAFETY_TIPS = [
  {
    id: 'space',
    icon: 'paw-outline',
    text: 'Give elephants at least 100 meters of space at all times.',
    color: '#1B5E20',
    route: '/tips/SpaceTip',
  },
  {
    id: 'photo',
    icon: 'warning-outline',
    text: 'Avoid using flash photography near elephants.',
    color: '#B71C1C',
    route: '/tips/PhotoTip',
  },
  {
    id: 'vehicle',
    icon: 'car-outline',
    text: 'Switch off vehicle engines when elephants are nearby.',
    color: '#E65100',
    route: '/tips/VehicleTip',
  },
  {
    id: 'night',
    icon: 'moon-outline',
    text: 'Stay indoors between dusk and dawn in high-alert zones.',
    color: '#4A148C',
    route: '/tips/NightTip',
  },
];

function NewsCarousel({ news }: { news: NewsItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % news.length;
      scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
      setActiveIndex(next);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, news.length]);

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return ''; }
  };

  if (news.length === 0) {
    return (
      <View style={[styles.newsCard, styles.newsPlaceholder]}>
        <Text style={styles.noNewsText}>No news available</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH));
        }}
      >
        {news.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.newsCard}
            onPress={() => router.push({ pathname: '/NewsDetail', params: { id: item.id, title: item.title, description: item.description, imageUrl: item.imageUrl, createdAt: item.createdAt } })}
          >
            <ImageBackground
              source={{ uri: item.imageUrl }}
              style={styles.newsImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.newsOverlay}>
                <Text style={styles.newsDate}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.readMoreRow}>
                  <Text style={styles.readMore}>Read more</Text>
                  <Ionicons name="arrow-forward" size={13} color="#fff" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {news.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${BASE_URL}/news`);
      if (res.ok) setNews(await res.json());
    } catch (e) {
      console.log('News fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="leaf" size={22} color="#2E7D32" />
          <Text style={styles.headerTitle}>EleAlert</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* News */}
        <Text style={styles.sectionTitle}>Latest News</Text>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        ) : (
          <NewsCarousel news={news} />
        )}

        {/* Nearby Activity */}
        <View style={styles.mapCard}>
          <View style={styles.mapCardHeader}>
            <Text style={styles.mapCardTitle}>Nearby Activity</Text>
            <View style={styles.liveTag}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Updates</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/home')}>
            <Image
              source={require('../assets/elephant_bg.png')}
              style={styles.mapPreviewImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapBtn} activeOpacity={0.85} onPress={() => router.push('/home')}>
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text style={styles.mapBtnText}>Open Full Map</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Tips */}
        <View style={styles.tipsHeader}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsRow}>
          {SAFETY_TIPS.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={[styles.tipCard, { borderLeftColor: tip.color }]}
              activeOpacity={0.8}
              onPress={() => router.push(tip.route as any)}
            >
              <View style={[styles.tipIconCircle, { backgroundColor: tip.color + '18' }]}>
                <Ionicons name={tip.icon as any} size={24} color={tip.color} />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.navContainer}>
        <BottomNav activeTab="Home" onTabPress={(id) => {
          if (id === 'Map') router.push('/home');
          else if (id === 'Profile') router.push('/Profile');
        }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#2E7D32', letterSpacing: -0.5 },
  bellBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12 },
  loadingBox: { height: 200, justifyContent: 'center', alignItems: 'center' },
  newsCard: { width: CARD_WIDTH },
  newsPlaceholder: { height: 200, backgroundColor: '#E5E7EB', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  noNewsText: { color: '#9CA3AF', fontSize: 14 },
  newsImage: { width: '100%', height: 200, justifyContent: 'flex-end' },
  newsOverlay: { backgroundColor: 'rgba(0,0,0,0.45)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 14 },
  newsDate: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  newsTitle: { fontSize: 16, fontWeight: '700', color: '#fff', lineHeight: 22 },
  readMoreRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  readMore: { fontSize: 12, color: '#fff', fontWeight: '600' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { backgroundColor: '#2E7D32', width: 18 },
  mapCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  mapCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mapCardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText: { fontSize: 12, color: '#22C55E', fontWeight: '600' },
  mapPreviewImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 12, backgroundColor: '#E5E7EB' },
  mapBtn: { backgroundColor: '#2E7D32', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  tipsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 },
  seeAll: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  tipsRow: { gap: 12, paddingRight: 4, paddingBottom: 4 },
  tipCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, width: 180, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  tipIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tipText: { fontSize: 13, color: '#374151', lineHeight: 19 },
  navContainer: { paddingBottom: 20, paddingHorizontal: 10 },
});
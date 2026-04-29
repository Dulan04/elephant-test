// app/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomNav from '@/components/BottomNav';
import { BASE_URL } from '@/constants/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const AUTO_SCROLL_INTERVAL = 4000;

// ─── Types ────────────────────────────────────────────────
type NewsItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

const SAFETY_TIPS = [
  { icon: 'paw-outline', text: 'Give elephants at least 100 meters of space at all times.', color: '#1B5E20' },
  { icon: 'warning-outline', text: 'Avoid using flash photography near elephants.', color: '#B71C1C' },
  { icon: 'car-outline', text: 'Switch off vehicle engines when elephants are nearby.', color: '#E65100' },
  { icon: 'moon-outline', text: 'Stay indoors between dusk and dawn in high-alert zones.', color: '#4A148C' },
];

// ─── News Carousel ─────────────────────────────────────────
function NewsCarousel({ news }: { news: NewsItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % news.length;
      // Fade out → scroll → fade in
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: false });
        setActiveIndex(next);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [activeIndex, news.length]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return ''; }
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
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
            setActiveIndex(idx);
          }}
        >
          {news.map((item) => (
            <View key={item.id} style={styles.newsCard}>
              <ImageBackground
                source={{ uri: item.imageUrl }}
                style={styles.newsImage}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.newsOverlay}>
                  <Text style={styles.newsDate}>{formatDate(item.createdAt)}</Text>
                  <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {news.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Main Home Screen ─────────────────────────────────────
export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/news`);
      if (response.ok) {
        const data: NewsItem[] = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.log('Could not load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (id: string) => {
    if (id === 'Map') {
      router.push('/home'); // navigates to the Map tab in home.tsx
    } else if (id === 'Profile') {
      router.push('/Profile');
    } else {
      setCurrentTab(id);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="leaf" size={22} color="#2E7D32" />
          <Text style={styles.headerTitle}>EleAlert</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── News Section ── */}
        <Text style={styles.sectionTitle}>Latest News</Text>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        ) : (
          <NewsCarousel news={news} />
        )}

        {/* ── Nearby Activity (Map Preview) ── */}
        <View style={styles.mapCard}>
          <View style={styles.mapCardHeader}>
            <Text style={styles.mapCardTitle}>Nearby Activity</Text>
            <View style={styles.liveTag}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Updates</Text>
            </View>
          </View>

          {/* Map preview image — tapping opens full map */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              // Switch to Map tab in the root home.tsx
              router.push('/home?tab=Map');
            }}
          >
            <Image
              source={require('../assets/elephant_bg.png')}
              style={styles.mapPreviewImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Open Full Map button */}
          <TouchableOpacity
            style={styles.mapBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/home?tab=Map')}
          >
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text style={styles.mapBtnText}>Open Full Map</Text>
          </TouchableOpacity>
        </View>

        {/* ── Safety Tips ── */}
        <View style={styles.tipsHeader}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsRow}
        >
          {SAFETY_TIPS.map((tip, i) => (
            <View key={i} style={[styles.tipCard, { borderLeftColor: tip.color }]}>
              <View style={[styles.tipIconCircle, { backgroundColor: tip.color + '18' }]}>
                <Ionicons name={tip.icon as any} size={24} color={tip.color} />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <View style={styles.navContainer}>
        <BottomNav activeTab={currentTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F3F4F6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#2E7D32', letterSpacing: -0.5 },
  bellBtn: { padding: 4 },

  // Scroll
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12 },

  // News Carousel
  newsCard: { width: CARD_WIDTH, marginRight: 0 },
  newsPlaceholder: {
    height: 200, backgroundColor: '#E5E7EB', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  noNewsText: { color: '#9CA3AF', fontSize: 14 },
  newsImage: { width: '100%', height: 200, justifyContent: 'flex-end' },
  newsOverlay: {
    backgroundColor: 'rgba(0,0,0,0.42)', borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16, padding: 14,
  },
  newsDate: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  newsTitle: { fontSize: 16, fontWeight: '700', color: '#fff', lineHeight: 22 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { backgroundColor: '#2E7D32', width: 18 },
  loadingBox: { height: 200, justifyContent: 'center', alignItems: 'center' },

  // Map Card
  mapCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginTop: 20, marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  mapCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  mapCardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText: { fontSize: 12, color: '#22C55E', fontWeight: '600' },
  mapPreviewImage: {
    width: '100%', height: 160, borderRadius: 12, marginBottom: 12,
    backgroundColor: '#E5E7EB',
  },
  mapBtn: {
    backgroundColor: '#2E7D32', borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  mapBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Safety Tips
  tipsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 20, marginBottom: 12,
  },
  seeAll: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  tipsRow: { gap: 12, paddingRight: 4 },
  tipCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    width: 180, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  tipIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tipText: { fontSize: 13, color: '#374151', lineHeight: 19 },

  // Nav
  navContainer: { paddingBottom: 20, paddingHorizontal: 10, backgroundColor: 'transparent' },
});
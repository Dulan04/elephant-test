import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type NavItem = {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

interface BottomNavProps {
  activeTab: string;
  onTabPress: (id: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  
  const navItems: NavItem[] = [
    { id: 'Home', label: 'Home', iconName: 'home-outline' },
    { id: 'Map', label: 'Map', iconName: 'location-outline' },
    { id: 'Chat', label: 'News', iconName: 'newspaper-outline'},
    { id: 'Resources', label: 'Resources', iconName: 'book-outline' },
    { id: 'Profile', label: 'Profile', iconName: 'person-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCurve}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          // Auto-switch icon: "home-outline" becomes "home" when active
          const iconName = isActive 
            ? (item.iconName.replace('-outline', '') as keyof typeof Ionicons.glyphMap)
            : item.iconName;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tabItem}
              onPress={() => onTabPress(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isActive ? '#F97316' : '#9CA3AF'}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // 1. Lifts the bar up from the bottom
    bottom: 0,
    // 2. Adds space from the sides (Floating effect)
    left: 0,
    right: 0,

  
    
    elevation: 0, 
  },
  backgroundCurve: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    
    // 3. Round ALL corners so it looks like a pill
    borderRadius:40, 
    
    paddingVertical: 40,
    // Note: We removed the extra conditional iOS padding because 
    // the bar is now floating above the home indicator area.
    paddingTop: 10, 
   
       // Reduced "up size" (was 25)
    // Kept the bottom size large
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#F97316',
    fontWeight: '700',
  },
});

export default BottomNav;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Define the structure of a navigation item
type NavItem = {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

// Define the props the component accepts
interface BottomNavProps {
  activeTab: string;
  onTabPress: (id: string) => void;
}

const { width } = Dimensions.get('window');

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  
  const navItems: NavItem[] = [
    { id: 'Home', label: 'Home', iconName: 'home-outline' },
    { id: 'Map', label: 'Map', iconName: 'location-outline' },
    { id: 'Chat', label: 'Chat', iconName: 'chatbox-ellipses-outline' },
    { id: 'Resources', label: 'Resources', iconName: 'book-outline' },
    { id: 'Profile', label: 'Profile', iconName: 'person-outline' },
  ];

  return (
    <View style={styles.container}>
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
              color={isActive ? '#F97316' : '#9CA3AF'} // Orange for active, Gray for inactive
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 80, // Height of the navbar
    paddingBottom: 20, // Padding for bottom of screen (iPhone home bar)
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    width: width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
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
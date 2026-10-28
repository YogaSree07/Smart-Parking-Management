import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export const SplashScreen = ({ navigation }) => {
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          if (role === 'admin') {
            navigation.replace('AdminStack');
          } else {
            navigation.replace('UserTabs');
          }
        } else {
          navigation.replace('Login');
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, role]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="car-sport" size={60} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>Smart Parking</Text>
      <Text style={styles.subtitle}>Management System</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>IoT & Mobile Architecture</Text>
      </View>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
      <Text style={styles.footer}>Academic & Enterprise Portfolio Project</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#93C5FD',
    marginTop: 4,
    fontWeight: '500',
  },
  badge: {
    marginTop: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.4)',
  },
  badgeText: {
    color: '#E0F2FE',
    fontSize: 12,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
});
